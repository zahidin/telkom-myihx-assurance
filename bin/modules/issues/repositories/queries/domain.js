const Command = require('../commands/command');
const Query = require('./query');
const model = require('./query_model');
const modelCommand = require('../commands/command_model');
const commonUtil = require('../../../../helpers/utils/common');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const Redis = require('../../../../helpers/databases/redis/redis');
const config = require('../../../../infra/configs/global_config');
const workStatus = require('../../utils/status');
const service = require('../../utils/service');
const moment = require('moment');
const validate = require('validate.js');
const common = require('../../utils/common');
const {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  ConflictError
} = require('../../../../helpers/error');

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
    this.query = new Query(db);
    this.command = new Command(db);
  }

  async getCategories(lang) {
    const categories = await this.query.findAll([{
      $group: {
        '_id': {
          'type': '$type'
        }
      }
    }]);
    if (categories.err) {
      return wrapper.error(new NotFoundError('Data not found'));
    }
    let arraysResult = [];
    const results = categories.data.map(async category => {
      let nameCategory = category._id.type;
      const assurance = model.assuranceModel();
      assurance.categoryId = nameCategory;
      assurance.name = nameCategory;
      arraysResult.push(assurance);
    });
    await Promise.all(results);
    return wrapper.data(arraysResult);
  }

  issueType(type) {
    let issueType = '';
    switch (type) {
    case 'TV':
      issueType = 'IPTV';
      break;
    case 'Telephone':
      issueType = 'VOICE';
      break;
    default:
      issueType = 'INTERNET';
      break;
    }
    return issueType;
  }

  async getIssuesByType(categoryId, lang) {
    const categories = await this.query.getIssuesByType(categoryId);
    if (categories.err) {
      return wrapper.error(new NotFoundError('Can not find categories'));
    }
    let arraysResult = [];
    const results = categories.data.map(async category => {
      let issues = '';
      if (lang === 'id') {
        issues = category.descriptionId;
      } else {
        issues = category.descriptionEn;
      }

      const assurance = model.issuesModel();
      assurance.symptomId = category.symptomId;
      assurance.category = category.type;
      assurance.issueType = this.issueType(category.type);
      assurance.issues = issues;
      assurance.technicalLanguage = category.technicalLanguage;
      assurance.fiber = category.fiber;
      assurance.cooper = category.copper;
      arraysResult.push(assurance);
    });
    await Promise.all(results);
    return wrapper.data(arraysResult);
  }

  async getIssuesId(categoryId, lang) {
    const categories = await this.query.getIssuesId(categoryId);
    if (categories.err) {
      return wrapper.error(new NotFoundError('Can not find categories'));
    }
    let arraysResult = [];
    const {
      data
    } = categories;
    let issues = '';
    if (lang === 'id') {
      issues = data.descriptionId;
    } else {
      issues = data.descriptionEn;
    }
    const assurance = model.issuesModel();
    assurance.symptomId = data.symptomId;
    assurance.category = data.type;
    assurance.issueType = this.issueType(data.type);
    assurance.issues = issues;
    assurance.technicalLanguage = data.technicalLanguage;
    assurance.fiber = data.fiber;
    assurance.cooper = data.copper;
    arraysResult.push(assurance);
    return wrapper.data(arraysResult);
  }

  async getScheduleAvailability(userId, lang) {
    const ctx = 'domain-getScheduleAvailability';
    const issueQuery = {
      userId,
      status: 'pending',
      ticketType: 'Fisik'
    };
    const issue = await this.query.findIssue(issueQuery);
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    const getSymptom = await this.query.findAssurance({
      symptomId: issue.data.symptom.symptomId
    });

    const user = await this.query.findOneUser({userId:userId});
    if (user.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', user.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }

    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(issue.data.psbAccount.installationDate);
    const secondDate = new Date(issue.data.createdAt);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    const startDate = new Date(new Date().setUTCHours(24, 0, 1)).toISOString();
    const sto = 'BIN'; //issue.data.psbAccount.sto;
    const getAvailabiltyDate = await redisClient.getData('AVAILABILITY:TECHNICIAN:' + sto + ':' + moment(startDate).format('YYYY-MM-DD'));

    let availabiltyDate;
    if (validate.isEmpty(JSON.parse(getAvailabiltyDate)) || validate.isEmpty(JSON.parse(getAvailabiltyDate).data)) {
      const allResponses = await this.getStartAndEndInMonth(sto, dataJwt, {crewId: issue.data.psbAccount.crewId, diffDays: diffDays});
      if (!validate.isEmpty(allResponses.data)){
        await redisClient.setDataEx('AVAILABILITY:TECHNICIAN:' + sto + ':' + moment(startDate).format('YYYY-MM-DD'), allResponses, 10 * 60);
      }
      availabiltyDate = allResponses.data;
    } else {
      const resultAvailabilty = JSON.parse(getAvailabiltyDate);
      availabiltyDate = resultAvailabilty.data.data;
    }

    const schedule = modelCommand.schedule({
      bookingId: '',
      scheduleAttempt: 0,
      timeBox: new Date(),
      timeSlot: '',
      availability: '',
      crewId: '',
      information: '',
      contactSecondary: ''
    });
    issue.data.schedule = schedule;
    const upsertIssue = await this.command.upsertIssues({
      issueId: issue.data.issueId
    }, {
      $set: issue.data
    });
    if (upsertIssue.err) {
      logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    let timeStart;
    if (validate.isEmpty(issue.data.schedule.timebox)) {
      timeStart = new Date();
    } else {
      timeStart = issue.data.schedule.timebox;
    }
    const timeNow = moment(new Date());
    const duration = moment.duration(timeNow.diff(timeStart));
    const hours = duration.hours().toString().length < 2 ? `0${duration.hours()}` : duration.hours();
    const minutes = duration.minutes().toString().length < 2 ? `0${duration.minutes()}` : duration.minutes();
    const seconds = duration.seconds().toString().length < 2 ? `0${duration.seconds()}` : duration.seconds();

    const result = model.availableService();
    result.timeBox = `${hours}:${minutes}:${seconds}`;
    result.timeInSeconds = duration.asSeconds();
    result.issueId = issue.data.issueId;
    result.indihomeNumber = issue.data.psbAccount.indihomeNumber;
    result.sto = issue.data.psbAccount.sto;
    result.message = issue.data.message;
    result.issueSummary = lang === 'id' ? getSymptom.data.descriptionId : getSymptom.data.descriptionEn;
    result.technicalLanguage = getSymptom.data.technicalLanguage;
    result.address = issue.data.psbAccount.address;
    result.schedule = availabiltyDate;

    return wrapper.data(result, 'Availability technician date', 200);
  }

  async reopenTechnician(userId, lang) {
    const ctx = 'domain-getScheduleReopenAvailability';
    const issueQuery = {
      userId,
      status: 'onProgress',
      work: 'COMPLETED',
      ticketType: 'Fisik'
    };
    const issue = await this.query.findIssue(issueQuery);
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    const getSymptom = await this.query.findAssurance({
      symptomId: issue.data.symptom.symptomId
    });

    const user = await this.query.findOneUser({userId:userId});
    if (user.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', user.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }

    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const startDate = new Date(new Date().setUTCHours(24, 0, 1)).toISOString();
    const sto = 'BIN'; //issue.data.psbAccount.sto;
    const getAvailabiltyReopenDate = await redisClient
      .getData('AVAILABILITY:TECHNICIAN:REOPEN:' + sto + ':' + moment(startDate).format('YYYY-MM-DD'));
    let availabiltyDate;
    if (validate.isEmpty(JSON.parse(getAvailabiltyReopenDate)) || validate.isEmpty(JSON.parse(getAvailabiltyReopenDate).data)) {
      const allResponses = await this.getStartAndEndInMonth(sto, dataJwt, {});
      await redisClient.setDataEx('AVAILABILITY:TECHNICIAN:REOPEN:' + sto + ':' + moment(startDate).format('YYYY-MM-DD'), allResponses, 10 * 60);
      availabiltyDate = allResponses.data;
    } else {
      const resultAvailabilty = JSON.parse(getAvailabiltyReopenDate);
      availabiltyDate = resultAvailabilty.data.data;
    }

    const schedule = modelCommand.schedule({
      bookingId: '',
      scheduleAttempt: 0,
      timeBox: new Date(),
      timeSlot: '',
      availability: '',
      crewId: '',
      information: '',
      contactSecondary: ''
    });
    issue.data.schedule = schedule;
    const upsertIssue = await this.command.upsertIssues({
      issueId: issue.data.issueId
    }, {
      $set: issue.data
    });
    if (upsertIssue.err) {
      logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    let timeStart;
    if (validate.isEmpty(issue.data.schedule.timebox)) {
      timeStart = new Date();
    } else {
      timeStart = issue.data.schedule.timebox;
    }
    const timeNow = moment(new Date());
    const duration = moment.duration(timeNow.diff(timeStart));
    const hours = duration.hours().toString().length < 2 ? `0${duration.hours()}` : duration.hours();
    const minutes = duration.minutes().toString().length < 2 ? `0${duration.minutes()}` : duration.minutes();
    const seconds = duration.seconds().toString().length < 2 ? `0${duration.seconds()}` : duration.seconds();

    const result = model.availableService();
    result.timeBox = `${hours}:${minutes}:${seconds}`;
    result.timeInSeconds = duration.asSeconds();
    result.issueId = issue.data.issueId;
    result.indihomeNumber = issue.data.psbAccount.indihomeNumber;
    result.sto = issue.data.psbAccount.sto;
    result.message = issue.data.message;
    result.issueSummary = lang === 'id' ? getSymptom.data.descriptionId : getSymptom.data.descriptionEn;
    result.technicalLanguage = getSymptom.data.technicalLanguage;
    result.address = issue.data.psbAccount.address;
    result.schedule = availabiltyDate;

    return wrapper.data(result, 'Availability reopen technician date', 200);
  }

  async getTicketDetails(payload) {
    const ctx = 'domain-getTicketDetails';
    const {userId, issueId, lang} = payload;
    const issue = await this.query.findIssue({userId,issueId});
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    const user = await this.query.findOneUser({userId:userId});
    if (user.err) {
      logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', user.err);
      return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
    }

    const getSymptom = await this.query.findAssurance({
      symptomId: issue.data.symptom.symptomId
    });

    const dataJwt = await commonUtil.getJwtLegacy();
    if (dataJwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    if (issue.data.ticketType === 'Fisik' && issue.data.work ==='ASSIGNED') {
      const technicianAssignment = await service.getDetailTeknisi({
        crewId: issue.data.schedule.crewId,
        jwt: dataJwt.data
      });
      if (technicianAssignment.err) {
        logger.error(ctx, 'error', 'Internal Server Error', technicianAssignment.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }
      if (technicianAssignment.statusCode === '-2') {
        logger.error(ctx, 'error', 'Technician not found', technicianAssignment.err);
        return wrapper.error(new InternalServerError('Technician not found'));
      }
      issue.data.technician = {
        personId: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].PERSONID,
        displayName: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].DISPLAYNAME,
        email: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].PRIMARYEMAIL,
        phone: technicianAssignment.data.AMCREWLABOR[0].LABOR[0].PERSON[0].PRIMARYPHONE
      };
      const upsertIssue = await this.command.upsertIssues({
        issueId: issue.data.issueId
      }, {
        $set: issue.data
      });
      if (upsertIssue.err) {
        logger.error(ctx, 'error', 'Internal server error', upsertIssue.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }
    }

    let ticketType = ['Admin', 'Logic'];
    if(ticketType.includes(issue.data.ticketType) && issue.data.work === 'RESOLVED'){
      /*
      * 0 = the default value when viewing assurance details
      * 1 = value when the ticket is closed
      * 2 = when I see details the second time
      */
      issue.data.read = 1;
      await common.sendAssuranceCardToKafka(issue.data);
    }

    const technicianProgress = await workStatus.status(issue.data.work);

    const result = model.detailTicket();
    result.issueId = issue.data.issueId;
    result.message = issue.data.message;
    result.issueSummary = lang === 'id' ? getSymptom.data.descriptionId : getSymptom.data.descriptionEn;
    result.type = issue.data.ticketType;
    result.category = issue.data.issueType;
    result.technicalLanguage = getSymptom.data.technicalLanguage;
    result.schedule = issue.data.schedule;
    result.address = issue.data.psbAccount.address;
    result.technician = issue.data.technician;
    result.progress = technicianProgress;

    return wrapper.data(result, 'Availability technician date', 200);
  }

  async rescheduleTicket(payload) {
    const ctx = 'domain-rescheduleTicket';
    const {userId, issueId, lang} = payload;
    const issue = await this.query.findIssue({userId,issueId, ticketType: 'Fisik'});
    if (issue.err) {
      logger.error(ctx, 'error', 'Ticket not found', issue.err);
      return wrapper.error(new NotFoundError('Ticket not found'));
    }

    if (!validate.isEmpty(issue.data.ticketId) && issue.data.work === 'ASSIGNED')
    {
      const getSymptom = await this.query.findAssurance({
        symptomId: issue.data.symptom.symptomId
      });

      const user = await this.query.findOneUser({userId:userId});
      if (user.err) {
        logger.error(ctx, 'error', 'User doesn\'t have privilege to perform this action. Required an active package', user.err);
        return wrapper.error(new UnauthorizedError('User doesn\'t have privilege to perform this action. Required an active package'));
      }

      const dataJwt = await commonUtil.getJwtLegacy();
      if (dataJwt.err) {
        logger.error(ctx, 'error', 'Internal Server Error', dataJwt.err);
        return wrapper.error(new InternalServerError('Internal server error'));
      }

      const startDate = new Date(new Date().setUTCHours(24, 0, 1)).toISOString();
      const sto = 'BIN'; //issue.data.psbAccount.sto;
      const getAvailabiltyDate = await redisClient.getData('AVAILABILITY:TECHNICIAN:' + sto + ':' + moment(startDate).format('YYYY-MM-DD'));
      let availabiltyDate;
      if (validate.isEmpty(JSON.parse(getAvailabiltyDate)) || validate.isEmpty(JSON.parse(getAvailabiltyDate).data)) {
        const allResponses = await this.getStartAndEndInMonth(sto, dataJwt, {});
        await redisClient.setDataEx('AVAILABILITY:TECHNICIAN:' + sto + ':' + moment(startDate).format('YYYY-MM-DD'), allResponses, 10 * 60);
        availabiltyDate = allResponses.data;
      } else {
        const resultAvailabilty = JSON.parse(getAvailabiltyDate);
        availabiltyDate = resultAvailabilty.data.data;
      }

      let timeStart;
      if (validate.isEmpty(issue.data.schedule.timebox)) {
        timeStart = new Date();
      } else {
        timeStart = issue.data.schedule.timebox;
      }
      const timeNow = moment(new Date());
      const duration = moment.duration(timeNow.diff(timeStart));
      const hours = duration.hours().toString().length < 2 ? `0${duration.hours()}` : duration.hours();
      const minutes = duration.minutes().toString().length < 2 ? `0${duration.minutes()}` : duration.minutes();
      const seconds = duration.seconds().toString().length < 2 ? `0${duration.seconds()}` : duration.seconds();

      const result = model.availableService();
      result.timeBox = `${hours}:${minutes}:${seconds}`;
      result.timeInSeconds = duration.asSeconds();
      result.issueId = issue.data.issueId;
      result.indihomeNumber = issue.data.psbAccount.indihomeNumber;
      result.sto = issue.data.psbAccount.sto;
      result.message = issue.data.message;
      result.issueSummary = lang === 'id' ? getSymptom.data.descriptionId : getSymptom.data.descriptionEn;
      result.technicalLanguage = getSymptom.data.technicalLanguage;
      result.address = issue.data.psbAccount.address;
      result.schedule = availabiltyDate;

      return wrapper.data(result, 'Reschedule technician', 200);
    }
    return wrapper.error(new ConflictError('Waiting for ticketID'));
  }

  async getStartAndEndInMonth(sto, jwt, psb = {}) {
    let results = [],
      nonEmptyDays = 0,
      numberOfDays = 14,
      retries = 0,
      filtered;
    while (retries < 6 && nonEmptyDays < numberOfDays) {
      let date = new Date();
      date.setDate(date.getDate() + retries * numberOfDays);
      if (psb.diffDays >= 1 && psb.diffDays <= 60){
        filtered = await service.getServiceTechnicianPsbParallel({
          numberOfDays: numberOfDays,
          sto: psb.crewId,
          startDate: date.toISOString(),
          jwt: jwt
        });
      }else{
        filtered = await service.getServiceTimesParallel({
          numberOfDays: numberOfDays,
          sto: sto,
          startDate: date.toISOString(),
          jwt: jwt
        });
      }
      for (let i = 0; i < filtered.length; i++) {
        const findAvailable = filtered[i].find(o => o.availability === 1);
        if (findAvailable) {
          await Promise.all(filtered[i].filter(d => d['availability'] === 1)
            .map(async (d) => {
              results.push(d);
            })
          );
          nonEmptyDays++;
          if (nonEmptyDays >= numberOfDays) {
            break;
          }
        }
      }
      retries++;
    }

    if (results.length > 0) {
      results = results
        .filter(s => s.date)
        .sort((a, b) => {
          const d1Splits = a.date.split('-');
          const d2Splits = b.date.split('-');
          const d1 = `${d1Splits[2]}-${d1Splits[1]}-${d1Splits[0]}`;
          const d2 = `${d2Splits[2]}-${d2Splits[1]}-${d2Splits[0]}`;
          if (d1 < d2) {
            return -1;
          }
          if (d2 < d1) {
            return 1;
          }
          return 0;
        });
    }
    return wrapper.data(results);
  }

  async getCommentByIssueId(issueId) {
    const comments = await this.query.findIssue({ issueId: issueId });
    if (comments.err) {
      return wrapper.error(new NotFoundError('Can not find comments'));
    }

    const { data } = comments;
    let arraysResult = [];
    const results = data.comments.map(async c => {
      const cmd = model.commentsModel();
      cmd.message = c.comment;
      cmd.date = moment(c.createdAt).format('DD/MM/YYYY');
      arraysResult.push(cmd);
    });
    await Promise.all(results);
    return wrapper.data(arraysResult.reverse());
  }
}

module.exports = Issue;
