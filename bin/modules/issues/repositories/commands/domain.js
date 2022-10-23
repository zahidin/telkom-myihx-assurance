const Query = require('../queries/query');
const Command = require('./command');
const model = require('./command_model');
const commonUtil = require('../../../../helpers/utils/common');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const service = require('../../utils/service');
const cekStatus = require('../../utils/status');
const Redis = require('../../../../helpers/databases/redis/redis');
const config = require('../../../../infra/configs/global_config');
const common = require('../../utils/common');
const {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  ServiceUnavailableError,
  ExpectationFailedError,
  BadRequestError,
  ConflictError
} = require('../../../../helpers/error');
const validate = require('validate.js');
const moment = require('moment');
const REDIS_CLIENT_CONFIGURATION = {
  connection: {
    host: config.get('/redisHost'),
    port: config.get('/redisPort'),
    password: config.get('/redisPassword')
  },
  index: config.get('/redisIndex')
};
const redisClient = new Redis(REDIS_CLIENT_CONFIGURATION);

class Issue {

  constructor(db) {
    this.command = new Command(db);
    this.query = new Query(db);
  }

  async createTicketIssue(payload) {
    const ctx = 'domain-createTicketIssue';
    let { userId, issueId, message, type, lang } = payload;
    const accountLinked = await this.query.findManyAccount({users: {$elemMatch: {userId: userId, isDeleted: false}}});
    if (accountLinked.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', accountLinked.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }

    const userProfile = await this.query.findOneUser({userId: userId});
    if (userProfile.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', userProfile.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }
    let indihomeNumber,ncli,telephoneNumber,sto,installationDate,transactionId,crewId,svmLevel = 0;
    let address = {
      description: '',
      province:'',
      city: '',
      district: '',
      postalCode:''
    };

    for (const account of accountLinked.data) {
      const user = account.users.find(({userId}) => userId === payload.userId);
      if (user && user.status === 'inactive') {
        const installationQuery = {
          userId: userId,
          status: {
            $in: ['PT1', 'PT2']
          },
          installationStatus: 'onGoingInstallation',
          'schedule.work': 'COMPLETED',
          'reserve.internetNumber': `${account.indihomeNumber}`
        };
        const psbData = await this.query.findPSB(installationQuery);
        if (psbData.data){
          indihomeNumber = account.indihomeNumber;
          ncli = account.ncli;
          telephoneNumber = account.phoneNumber;
          sto = account.sto;
          address = account.address;
          installationDate = psbData.data.schedule.timeSlot.date;
          crewId = psbData.data.schedule.crewId;
          transactionId = psbData.data.transactionId;
          svmLevel = 1; // case for users of psb, the svm level will automatically be svm 1
        }
      }
    }

    if (validate.isEmpty(indihomeNumber)){
      for (const account of accountLinked.data) {
        const user = account.users.find(({userId}) => userId === payload.userId);
        if (user && user.status === 'active') {
          svmLevel = user.svmLevel;
          indihomeNumber = account.indihomeNumber;
          ncli = account.ncli;
          telephoneNumber = account.phoneNumber;
          sto = account.sto;
          address = account.address;
          installationDate = '';
          crewId = '';
          transactionId = '';
        }
      }
    }

    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    const checkInquiryData = await service.checkInquiry({
      jwt:dataJwt,
      indihomeNumber: indihomeNumber
    });
    if(checkInquiryData.err) {
      logger.error(ctx, 'error', 'Internal Server Error', JSON.stringify(checkInquiryData.err));
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    if(checkInquiryData.statusCode !== '-2' && !validate.isEmpty(checkInquiryData.data) && !validate.isEmpty(checkInquiryData.data.amount)) {
      const newResultResponse = model.responseResult();
      newResultResponse.status = 'OUTSTANDING';
      newResultResponse.amount = checkInquiryData.data.amount;
      const messageOutstanding = await cekStatus.messageOutstanding(lang);
      newResultResponse.title = messageOutstanding.title;
      newResultResponse.description = messageOutstanding.description;
      const resultInquiry = {
        indihomeNum: indihomeNumber,
        status: newResultResponse.status,
        amount: newResultResponse.amount,
        title: newResultResponse.title,
        description: newResultResponse.description
      };
      return wrapper.error(new BadRequestError({
        data: resultInquiry,
        message: messageOutstanding.title,
        code: 1004
      }));
    }

    const psbData = {
      indihomeNumber: indihomeNumber,
      ncli: ncli,
      telephoneNumber: telephoneNumber || '',
      sto: sto,
      address: `${address.description} ${address.district} ,${address.city},` +
          `${address.province} - ${address.postalCode} `,
      installationDate: installationDate,
      transactionId: transactionId,
      crewId:crewId
    };

    const issue = await this.query.findAssurance({
      symptomId: issueId
    });
    if (issue.err) {
      logger.error(ctx, 'error', 'issue not found', issue.err);
      return wrapper.error(new NotFoundError('issue not found'));
    }

    let isFiber;
    const cableType = await service.checkCableType({
      indihomeNumber: indihomeNumber,
      service: type,
      jwt: dataJwt.data
    });
    if (cableType.err || cableType.statusCode === '-2') {
      isFiber = 'Fiber';
    } else {
      isFiber = cableType.data.cableType;
    }

    const iBoosterData = await service.getIboosterInfo({
      indihomeNumber: indihomeNumber,
      jwt: dataJwt.data
    });
    if (iBoosterData.err) {
      logger.error(ctx, 'error', 'Internal Server Error', iBoosterData.err);
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    const iBooster = iBoosterData.statusCode === '-2' ? {} : iBoosterData.data;
    const iBoosterInSpec = await this.checkIboosterRange({iBooster:iBooster});
    const isAcsReset = await this.checkACSResetStatus(indihomeNumber);
    const getSpec = await this.getSpec({type:type,isFiber:isFiber,iBoosterInSpec:iBoosterInSpec,fiber:issue.data.fiber, copper: issue.data.copper});
    let ticketCategoryType = await this.checkCategoriesTicket({getSpec:getSpec,type:issue.data.type,iBoosterInSpec:iBoosterInSpec});
    let queryIssue;
    if (ticketCategoryType !== 'Admin'){
      queryIssue = {
        userId,
        'psbAccount.indihomeNumber': indihomeNumber,
        ticketType: iBoosterInSpec === true ? 'Logic' : 'Fisik',
        status: {
          $ne: 'close'
        }
      };
    }else{
      queryIssue = {
        userId,
        'psbAccount.indihomeNumber': indihomeNumber,
        ticketType: 'Admin',
        status: {
          $ne: 'close'
        }
      };
    }
    const pendingTicket = await this.query.findIssue(queryIssue);
    if (!validate.isEmpty(pendingTicket.data) && pendingTicket.data.status !== 'pending') {
      logger.error(ctx, 'error', `User already has existing ticket of this category ${ticketCategoryType}`, pendingTicket.data);
      const result = {
        message: 'User already has existing ticket of this category',
        data: pendingTicket.data
      };
      return wrapper.error(new ConflictError(result));
    }
    const bookingId = 'MYINX-' + new Date().getTime();
    let status = 'pending';
    if (iBoosterInSpec || ticketCategoryType !== 'Fisik') {
      if (isAcsReset && svmLevel !== 0) {
        logger.info(ctx, 'ACS has not reset in past hour. Please ask user to reset the modem', 'issue', isAcsReset);
        return wrapper.error(new BadRequestError({
          code: 1001,
          data: '',
          message: 'ACS has not reset in past hour. Please ask user to reset the modem'
        }));
      }
      const parameter = {
        transactionId: bookingId,
        assetNum: type === 'VOICE' ? `${psbData.ncli}_${psbData.telephoneNumber}_${type}`: `${psbData.ncli}_${psbData.indihomeNumber}_${type}`,
        installation: psbData,
        issueType: type,
        ticketType: ticketCategoryType,
        symptomId: getSpec.replace(/.(?:\s\/\/\/\/\s)/igm, ' \\\\ '),
        user: userProfile.data,
        message: message,
        bookingId: '',
        symptom: issue.data
      };
      const createInbox = await service.reportIssue({params: parameter,jwt: dataJwt.data});
      if (createInbox.err) {
        logger.error(ctx, 'error', 'Internal Server Error', createInbox);
        return wrapper.error(new InternalServerError('Internal server error'));
      }
      status = 'open';
    }

    const symptomData = {
      symptomId: issue.data.symptomId,
      clasificationId: getSpec,
      isFiber: isFiber,
      iBooster: iBooster
    };

    const ticket = model.issue();
    ticket.userId = userId;
    ticket.assetNum = type === 'VOICE' ? `${psbData.ncli}_${psbData.telephoneNumber}_${type}`: `${psbData.ncli}_${psbData.indihomeNumber}_${type}`;
    ticket.psbAccount = psbData;
    ticket.symptom = symptomData;
    ticket.issueType = type;
    ticket.ticketType = ticketCategoryType;
    ticket.message = message;
    ticket.status = status;
    ticket.work = ticketCategoryType === 'Fisik' ? '' : 'RECEIVED';
    ticket.createdAt = new Date();
    ticket.lastModified = new Date();
    let createTicket;
    if (!validate.isEmpty(pendingTicket.data) && pendingTicket.data.status === 'pending'){
      ticket.issueId = pendingTicket.data.issueId;
      createTicket = await this.command.upsertIssues({
        issueId: pendingTicket.data.issueId
      }, {
        $set: ticket
      });
      ticket.indihomeNumber = psbData.indihomeNumber;
      await common.sendAssuranceCardToKafka(ticket);
    }else{
      ticket.issueId = bookingId;
      createTicket = await this.command.insertIssue(ticket);
      ticket.indihomeNumber = psbData.indihomeNumber;
      await common.sendAssuranceCardToKafka(ticket);
    }
    if (createTicket.err) {
      logger.error(ctx, 'error', 'Internal server error', createTicket.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    logger.info(ctx, 'success create ticket', 'issue', ticket);
    return wrapper.data(ticket, 'success create ticket', 200);
  }

  async postScheduleIssue(payload) {
    const ctx = 'domain-postScheduleIssue';
    let {
      userId,
      bookingId,
      schedule,
      crewId,
      information,
      contactSecondary
    } = payload;

    const issueQuery = {
      userId,
      status: {
        $nin: ['close']
      },
      ticketType: 'Fisik'
    };
    const issue = await this.query.findIssue(issueQuery);
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    const user = await this.query.findOneUser({userId: userId});
    if (user.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', user.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }

    const assurance = await this.query.findAssurance({
      symptomId: issue.data.symptom.symptomId
    });
    if (assurance.err) {
      logger.error(ctx, 'error', 'symptom not found', assurance.err);
      return wrapper.error(new NotFoundError('symptom not found'));
    }

    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const parameter = {
      transactionId: issue.data.issueId,
      assetNum: issue.data.assetNum,
      installation: issue.data.psbAccount,
      issueType: issue.data.issueType,
      ticketType: issue.data.ticketType,
      symptomId: issue.data.symptom.clasificationId.replace(/.(?:\s\/\/\/\/\s)/igm, ' \\\\ '),
      user: user.data,
      message: issue.data.message,
      bookingId: bookingId,
      symptom: assurance.data
    };
    const createInbox = await service.reportIssue({
      params: parameter,
      jwt: dataJwt.data
    });
    if (createInbox.err) {
      logger.error(ctx, 'error', 'Internal Server Error', createInbox);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const ticket = model.issue();
    ticket.issueId = issue.data.issueId;
    ticket.assetNum = issue.data.assetNum;
    ticket.psbAccount = issue.data.psbAccount;
    ticket.userId = issue.data.userId;
    ticket.symptom = issue.data.symptom;
    ticket.issueType = issue.data.issueType;
    ticket.ticketType = issue.data.ticketType;
    ticket.message = issue.data.message;
    ticket.status = 'open';
    ticket.schedule = {
      bookingId: bookingId,
      scheduleAttempt: issue.data.schedule.scheduleAttempt,
      timeBox: null,
      timeSlot: schedule,
      availability: 1,
      crewId: crewId,
      information: information,
      contactSecondary: contactSecondary
    };
    ticket.work = 'SUBMITTED';
    ticket.lastModified = new Date();
    const sto = 'BIN'; //issue.data.psbAccount.sto;
    const dateRedis = new Date(new Date(Date.parse(issue.data.schedule.timeBox)).setUTCHours(24, 0, 1)).toISOString();
    const key = 'AVAILABILITY:TECHNICIAN:' + sto + ':' + moment(dateRedis).format('YYYY-MM-DD');
    await redisClient.deleteKey(key);
    issue.data = ticket;
    const upsertIssue = await this.command.upsertIssues({
      issueId: issue.data.issueId
    }, {
      $set: issue.data
    });
    if (upsertIssue.err) {
      logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    ticket.indihomeNumber = issue.data.psbAccount.indihomeNumber;
    await common.sendAssuranceCardToKafka(ticket);
    logger.info(ctx, 'success post schedule technician', 'issue', user);
    return wrapper.data(ticket, 'success post schedule technician', 200);
  }

  async postReopenScheduleIssue(payload) {
    const ctx = 'domain-postReopenScheduleIssue';
    let {
      userId,
      bookingId,
      schedule,
      crewId,
      information,
      contactSecondary
    } = payload;

    const issueQuery = {
      userId,
      status: {
        $nin: ['close']
      },
      ticketType: 'Fisik'
    };
    const issue = await this.query.findIssue(issueQuery);
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    const user = await this.query.findOneUser({userId:userId});
    if (user.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', user.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }

    const assurance = await this.query.findAssurance({
      symptomId: issue.data.symptom.symptomId
    });
    if (assurance.err) {
      logger.error(ctx, 'error', 'symptom not found', user.err);
      return wrapper.error(new NotFoundError('symptom not found'));
    }

    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const parameter = {
      transactionId: issue.data.issueId,
      ticketID: issue.data.ticketId,
      bookingId: bookingId,
    };

    const createInbox = await service.reportReopenIssue({
      params: parameter,
      jwt: dataJwt.data
    });
    if (createInbox.err) {
      logger.error(ctx, 'error', 'Internal Server Error', createInbox);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const ticket = model.issue();
    ticket.issueId = issue.data.issueId;
    ticket.assetNum = issue.data.assetNum;
    ticket.psbAccount = issue.data.psbAccount;
    ticket.userId = issue.data.userId;
    ticket.symptom = issue.data.symptom;
    ticket.issueType = issue.data.issueType;
    ticket.ticketType = issue.data.ticketType;
    ticket.message = issue.data.message;
    ticket.status = 'reopen';
    ticket.schedule = {
      bookingId: bookingId,
      scheduleAttempt: issue.data.schedule.scheduleAttempt,
      timeBox: null,
      timeSlot: schedule,
      availability: 1,
      crewId: crewId,
      information: information,
      contactSecondary: contactSecondary
    };
    ticket.work = 'SUBMITTED';
    ticket.lastModified = new Date();

    issue.data = ticket;
    const upsertIssue = await this.command.upsertIssues({
      issueId: issue.data.issueId
    }, {
      $set: issue.data
    });
    if (upsertIssue.err) {
      logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    ticket.indihomeNumber = issue.data.psbAccount.indihomeNumber;
    await common.sendAssuranceCardToKafka(ticket);
    logger.info(ctx, 'success post schedule technician', 'issue', user);
    return wrapper.data(ticket, 'success post schedule technician', 200);
  }

  async rescheduleTicket(payload) {
    const ctx = 'domain-rescheduleTicket';
    let {
      userId,
      issueId,
      bookingId,
      schedule,
      crewId,
      information,
      contactSecondary
    } = payload;

    const issueQuery = {
      userId,
      issueId: issueId,
      ticketType: 'Fisik'
    };
    const issue = await this.query.findIssue(issueQuery);
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    if (issue.data.schedule.scheduleAttempt >= 2){
      logger.info(ctx, 'error', 'You have exceeded reschedule technician limit');
      return wrapper.error(new ExpectationFailedError('You have exceeded reschedule technician limit'));
    }

    if (!validate.isEmpty(issue.data.ticketId) && issue.data.work === 'ASSIGNED'){
      const dataJwt = await commonUtil.getJwtLegacy();
      if (dataJwt.err) {
        logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }

      const parameter = {
        transactionId: issue.data.issueId,
        ticketID: issue.data.ticketId,
        bookingId: bookingId,
      };

      const createInbox = await service.reportReopenIssue({
        params: parameter,
        jwt: dataJwt.data
      });
      if (createInbox.err) {
        logger.error(ctx, 'error', 'Internal Server Error', createInbox.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }

      issue.data.schedule = {
        bookingId: bookingId,
        scheduleAttempt: issue.data.schedule.scheduleAttempt + 1,
        timeBox: null,
        oldtimeSlot: issue.data.schedule.timeSlot,
        timeSlot: schedule,
        availability: 1,
        crewId: crewId,
        information: information,
        contactSecondary: contactSecondary
      };
      issue.data.lastModified = new Date();
      const upsertIssue = await this.command.upsertIssues({
        issueId: issue.data.issueId
      }, {
        $set: issue.data
      });
      if (upsertIssue.err) {
        logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }
      return wrapper.data(issue.data, 'success post schedule technician', 200);
    }
    logger.error(ctx, 'error', 'Waiting for ticketID');
    return wrapper.error(new InternalServerError('Waiting for ticketID'));
  }

  async updateTicketId(payload) {
    const ctx = 'domain-updateTicketId';
    let {
      transactionId,
      ticketId
    } = payload;

    const issue = await this.query.findIssue({
      issueId: transactionId
    });
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    let technician = {};
    if (issue.data.ticketType === 'Fisik') {
      const technicianAssignment = await service.getDetailTeknisi({
        crewId: issue.data.schedule.crewId,
        jwt: dataJwt.data
      });
      if (technicianAssignment.err || technicianAssignment.statusCode === '-2') {
        logger.error(ctx, 'error', 'Internal Server Error', technicianAssignment.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }
      technician = {
        personId: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].PERSONID,
        displayName: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].DISPLAYNAME,
        email: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].PRIMARYEMAIL,
        phone: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].PRIMARYPHONE
      };
      issue.data.work = 'ASSIGNED';
    }
    issue.data.technician = technician;
    issue.data.ticketId = ticketId;
    const upsertIssue = await this.command.upsertIssues({
      issueId: issue.data.issueId
    }, {
      $set: issue.data
    });
    if (upsertIssue.err) {
      logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    return wrapper.data(upsertIssue.data, 'updated ticketId', 200);
  }

  async updateStatusTicket(payload) {
    const ctx = 'domain-updateStatusTicket';
    let { ticketId, transactionId, status } = payload;
    let query = '';
    if (!validate.isEmpty(ticketId)) {
      query = { ticketId: ticketId };
    } else {
      query = { issueId: transactionId };
    }
    const issue = await this.query.findIssue(query);
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    if (issue.data.work === status) {
      return wrapper.error(new ServiceUnavailableError(`Ticket already in ${status}`));
    }

    switch (status) {
    case 'RESOLVED':
      issue.data.status = 'close';
      break;
    case 'IN_PROGRESS':
      issue.data.status = 'onProgress';
      break;
    case 'COMPLETED':
      issue.data.status = 'onProgress';
      break;
    default:
      issue.data.status = 'open';
      break;
    }
    issue.data.work = status;
    issue.data.lastModified = new Date();
    const upsertIssue = await this.command.upsertIssues({ issueId: issue.data.issueId }, { $set: issue.data });
    if (upsertIssue.err) {
      logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    await common.sendAssuranceCardToKafka(issue.data);
    return wrapper.data(upsertIssue.data, 'Updated ticket status successfully', 200);
  }

  async reopenTicket(payload) {
    const ctx = 'domain-reopenTicket';
    const { userId, transactionId, message } = payload;
    const issue = await this.query.findIssue({issueId: transactionId, userId: userId});
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    if (issue.data.work === 'COMPLETED') {
      const dataJwt = await commonUtil.getJwtLegacy();
      if (dataJwt.err) {
        logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }
      const resultReopen = await service.setReopenTicket({ticketId: issue.data.ticketId, jwt: dataJwt});
      if (resultReopen.err){
        logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }

      if(issue.data.ticketType !== 'Fisik') {
        issue.data.status = 'reopen';
        issue.data.messageReopen = message;
        issue.data.work = 'IN_PROGRESS';
      }else{
        issue.data.messageReopen = message;
      }
      const reopen = await this.command.upsertIssues({ issueId: issue.data.issueId }, { $set: issue.data });
      if (reopen.err) {
        logger.error(ctx, 'error', 'Internal server error', reopen.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }

      await common.sendAssuranceCardToKafka(issue.data);
      return wrapper.data(reopen.data, 'Updated ticket status successfully', 200);
    }
    return wrapper.error(new ServiceUnavailableError('Ticket still in progress, wait until completed'));
  }

  async closeTicket(payload) {
    const ctx = 'domain-closeTicket';
    const { userId, transactionId } = payload;
    const issue = await this.query.findIssue({issueId: transactionId, userId: userId});
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    if (issue.data.work === 'COMPLETED') {
      issue.data.status = 'close';
      issue.data.work = 'RESOLVED';
      const reopen = await this.command.upsertIssues({ issueId: issue.data.issueId }, { $set: issue.data });
      if (reopen.err) {
        logger.error(ctx, 'error', 'Internal server error', reopen.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }

      await common.sendAssuranceCardToKafka(issue.data);
      return wrapper.data(reopen.data, 'Updated ticket status successfully', 200);
    }
    return wrapper.error(new ServiceUnavailableError('Ticket still in progress, wait until completed'));
  }

  async checkIboosterRange(data) {
    const iboosterRange = {
      MIN: -25,
      MAX: -13
    };
    const range = data.iBooster.onu_rx_pwr;
    if (iboosterRange.MIN < range && range < iboosterRange.MAX) {
      logger.info('IBooster in range.');
      return true;
    }
    logger.info('Ibooster not in range');
    return false;
  }

  async checkACSResetStatus(data) {
    const result = await this.query.findOneModem({indihomeNumber:data});
    if (result.err){
      return true;
    }
    const duration = moment.duration(moment(new Date()).diff(result.data.rebootTime));
    if (duration > 3601){
      return true;
    }
    return false;

  }

  async checkCategoriesTicket(data){
    if(await cekStatus.categories(data.type)==='Admin'){
      return 'Admin';
    }
    if (data.iBoosterInSpec){
      return 'Logic';
    }
    return 'Fisik';
  }

  async getSpec(data){
    if (data.type === 'VOICE'){
      if (data.iBoosterInSpec){
        return data.copper.classificationId3Spec;
      }
      return data.copper.classificationId3UnderSpec;
    }
    if (data.isFiber === 'Fiber' && data.iBoosterInSpec) {
      return data.fiber.classificationId3Spec;
    }else if (data.isFiber === 'Fiber' && !data.iBoosterInSpec){
      return data.fiber.classificationId3UnderSpec;
    }else if (data.isFiber === 'Copper' && data.iBoosterInSpec){
      return data.copper.classificationId3Spec;
    }
    return data.copper.classificationId3UnderSpec;
  }

  async addComment(payload) {
    const ctx = 'domain-adComment';
    let { issueId, comment } = payload;

    const issue = await this.query.findIssue({ issueId: issueId });
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    const upsertIssue = await this.command.upsertIssues({
      issueId: issue.data.issueId
    }, {
      $push: { comments: {
        'comment': comment,
        'createdAt': new Date()
      }}
    });
    if (upsertIssue.err) {
      logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    logger.info(ctx, 'Success add comment successfully');
    return wrapper.data(upsertIssue, 'Add comment successfully', 200);
  }

}

module.exports = Issue;
