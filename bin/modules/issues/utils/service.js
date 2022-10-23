const rp = require('request-promise');
const config = require('../../../infra/configs/global_config');
const { InternalServerError } = require('../../../helpers/error');
const logger = require('../../../helpers/utils/logger');
const wrapper = require('../../../helpers/utils/wrapper');
const validate = require('validate.js');
const moment = require('moment');

const getPelanggan = async (parameter) => {
  const ctx = 'service-checkCableType';
  const { indihomeNumber,jwt } = parameter;
  const payload = {
    nd: indihomeNumber,
    ncli: ''
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-mihx-pelanggan/1.0/getPelanggan`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const getPortofolio = async (parameter) => {
  const ctx = 'service-checkCableType';
  const { indihomeNumber,jwt } = parameter;
  const payload = {
    ND: indihomeNumber
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-isiska-getPortofolio/1.0/getPortofolio`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const checkCableType = async (parameter) => {
  const ctx = 'service-checkCableType';
  const { indihomeNumber, service, jwt } = parameter;
  const payload = {
    ND: indihomeNumber,
    serviceName: service.toUpperCase()
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-uim-device/1.0/checkCableType`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const getIboosterInfo = async (parameter) => {
  const ctx = 'service-getIboosterInfo';
  const { indihomeNumber, jwt } = parameter;
  const payload = {
    nd: indihomeNumber,
    realm: 'telkom.net'
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-ibooster-ukur/1.0/ukur`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const getDetailTeknisi = async (parameter) => {
  const ctx = 'service-getDetailTeknisi';
  const { crewId, jwt } = parameter;
  const payload = {
    crewId: crewId
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-wfm-detailteknisi/1.0/detailTeknisi`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const reportIssue = async (parameter) => {
  const ctx = 'service-reportIssue';
  const { params, jwt } = parameter;
  let ticketType = '';
  if (params.ticketType === 'Admin'){
    ticketType = 'ADMINISTRASI';
  }else{
    ticketType = 'TEKNIKAL';
  }
  const payload = {
    EXTTransactionID: `${params.transactionId}`,
    locale: 'id_id',
    incidentList: {
      incident: [
        {
          assetNum: `${params.assetNum}`,
          class: 'INCIDENT',
          description: `${params.symptom.descriptionEn}`,
          longDescription: !validate.isEmpty(params.message) ? params.message:params.symptom.technicalLanguage,
          externalSystem: 'RIGHTNOW',
          internalPriority: '2',
          reportedBy: `${params.user.fullName}`,
          reportDate: `${new Date().toISOString()}`,
          statusDate: `${new Date().toISOString()}`,
          channel: '40',
          contactEmail: `${params.user.email}`,
          contactName: `${params.user.fullName}`,
          contactPhone: `${params.user.mobileNumber}`,
          gaul: '0',
          hardComplaint: '2',
          lapul: '0',
          urgensi: '3',
          ticketType: ticketType,
          idReference: `${params.transactionId}`,
          bookingID: `${params.bookingId}`,
          hierarchy: `${params.symptomId}`,
          symptomID: ''
        }
      ]
    }
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-myihx-ticketassurance/1.0/createTicketAssurance`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const reportReopenIssue = async (parameter) => {
  const ctx = 'service-reportIssue';
  const { params, jwt } = parameter;
  const payload = {
    EXTTransactionID: `${params.transactionId}`,
    locale: 'id_id',
    incidentList: {
      incident: [
        {
          ticketID: `${params.ticketID}`,
          bookingID: `${params.bookingID}`
        }
      ]
    }
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-newoss-incident/1.0/updateIncident`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const getServiceTimesParallel = async (parameter) => {
  const ctx = 'service-getServiceTimesParallel';
  const { startDate, numberOfDays, sto, jwt } = parameter;
  const days = [...Array(numberOfDays).keys()]
    .map(i => {
      let date = new Date(Date.parse(startDate));
      date.setDate(date.getDate() + i);
      return date.toISOString();
    })
    .map( async date => await getAvailableServiceTimes({date:date, sto:sto, jwt:jwt})
      .catch(e =>
        logger.error(ctx, 'error', 'Internal Server Error', e)
      )
    );

  let allResponses = await Promise.all(days);
  let filtered = [];
  if (allResponses) {
    filtered = allResponses.filter(result => result && result.statusCode === '0' && result.data && result.data.SCHEDULE )
      .filter(result => result.data.SCHEDULE.some(r => r['mx:AVAILABILITY'] === 'AVAILABLE'))
      .map(result => {
        let allSlots = result.data.SCHEDULE
          .map(element => {
            let timeSlot ={};
            if (!validate.isEmpty(element['mx:JADWAL'])) {
              let dateCore = element['mx:JADWAL'].split(' ')[0];
              let date = dateCore.split('-').reverse().join('-');
              let time = element['mx:JADWAL'].split(' ')[1];
              let hour = time.split(':')[0];
              if (hour >= 8 && hour < 10) {
                timeSlot = {
                  slotId: 'early-morning',
                  slot: '8:00 - 10:00',
                  time,
                  date
                };
              } else if (hour >= 10 && hour < 12) {
                timeSlot = {
                  slotId: 'morning',
                  slot: '10:00 - 12:00',
                  time,
                  date
                };
              } else if (hour >= 13 && hour < 15) {
                timeSlot = {
                  slotId: 'noon',
                  slot: '13:00 - 15:00',
                  time,
                  date
                };
              } else if (hour >= 15 && hour <= 17) {
                timeSlot = {
                  slotId: 'evening',
                  slot: '15:00 - 17:00',
                  time,
                  date
                };
              }
            }
            return {
              dateTime: element['mx:JADWAL'],
              availability: element['mx:AVAILABILITY'] === 'AVAILABLE' ? 1 : 0,
              crewId: element['mx:CREWID'],
              information: element['mx:KETERANGAN'],
              bookingId: element['mx:BOOKINGID'],
              timeSlot,
              date: timeSlot['date'],
              slotId: timeSlot['slotId']
            };
          })
          .filter(r => r.timeSlot)
          .filter(r => r.slotId);

        let groupedSlots = allSlots.reduce((rv, x) => {
          (rv[x['slotId']] = rv[x['slotId']] || []).push(x);
          return rv;
        }, {});

        return Object.values(groupedSlots).map(slots => {
          const [firstSlot] = slots.sort((a, b) => b.availability - a.availability);
          return firstSlot;
        });
      });
  }
  return filtered;
};

const getAvailableServiceTimes = async (parameter) => {
  const ctx = 'service-getServiceTimesParallel';
  const { date, sto, jwt } = parameter;
  const payload = {
    scheduleDate: date,
    RK: '',
    STO: sto
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-nossa-listschedule/1.0/TKRN_SCHEDULE`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt.data}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const getServiceTechnicianPsbParallel = async (parameter) => {
  const ctx = 'service-getServiceTechnicianPsbParallel';
  const { startDate, numberOfDays, sto, jwt } = parameter;
  const days = [...Array(numberOfDays).keys()]
    .map(i => {
      let date = new Date(Date.parse(startDate));
      date.setDate(date.getDate() + i);
      let startDay = new Date(Date.parse(date.toISOString())+ (1000 * 60 * 60)).toISOString();
      let endDay = new Date(Date.parse(startDay)+ (1000 * 60 * 60 * 24)).toISOString();
      return moment(startDay).format('YYYY-MM-DD') + ' TO ' + moment(endDay).format('YYYY-MM-DD');
    })
    .map( async date => await getAvailableTechnicianPsbService({date:date, crewId:sto, jwt:jwt})
      .catch(e =>
        logger.error(ctx, 'error', 'Internal Server Error', e)
      )
    );
  let allResponses = await Promise.all(days);
  let filtered = [];
  if (allResponses) {
    filtered = allResponses.filter(result => result && result.statusCode === '0' && result.data && result.data.schedule )
      .filter(result => result.data.schedule.some(r => r['availability'] === 'AVAILABLE'))
      .map(result => {
        let allSlots = result.data.schedule
          .map(element => {
            let timeSlot ={};
            if (!validate.isEmpty(element['jadwal'])) {
              let dateCore = element['jadwal'].split(' ')[0];
              let date = dateCore.split('-').reverse().join('-');
              let time = element['jadwal'].split(' ')[1];
              let hour = time.split(':')[0];
              if (hour >= 8 && hour < 10) {
                timeSlot = {
                  slotId: 'early-morning',
                  slot: '8:00 - 10:00',
                  time,
                  date
                };
              } else if (hour >= 10 && hour < 12) {
                timeSlot = {
                  slotId: 'morning',
                  slot: '10:00 - 12:00',
                  time,
                  date
                };
              } else if (hour >= 13 && hour < 15) {
                timeSlot = {
                  slotId: 'noon',
                  slot: '13:00 - 15:00',
                  time,
                  date
                };
              } else if (hour >= 15 && hour <= 17) {
                timeSlot = {
                  slotId: 'evening',
                  slot: '15:00 - 17:00',
                  time,
                  date
                };
              }
            }
            return {
              dateTime: element['jadwal'],
              availability: element['availability'] === 'AVAILABLE' ? 1 : 0,
              crewId: element['crewID'],
              information: '',
              bookingId: element['bookingId'],
              timeSlot,
              date: timeSlot['date'],
              slotId: timeSlot['slotId']
            };
          })
          .filter(r => r.timeSlot)
          .filter(r => r.slotId);

        let groupedSlots = allSlots.reduce((rv, x) => {
          (rv[x['slotId']] = rv[x['slotId']] || []).push(x);
          return rv;
        }, {});

        return Object.values(groupedSlots).map(slots => {
          const [firstSlot] = slots.sort((a, b) => b.availability - a.availability);
          return firstSlot;
        });
      });
  }
  return filtered;
};

const getAvailableTechnicianPsbService = async (parameter) => {
  const ctx = 'service-getAvailableTechnicianPsbService';
  const { date, crewId, jwt } = parameter;
  const payload = {
    amCrew: crewId,
    scheduleDate: date
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-mihx-avail/1.0/tkrnAmCrewAvail`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt.data}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const setReopenTicket = async (parameter) => {
  const ctx = 'service-mediaCaringFaultHandling';
  const { ticketId, jwt } = parameter;
  const payload = {
    ticketId: ticketId,
    status: 'BACKEND',
    channel: '40'
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-newoss-mediacaring/1.0/mediaCaringFaultHandling`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt.data}`
    },
    body: payload,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'options');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const checkInquiry = async (params) => {
  const ctx = 'service-checkInquiry';
  const { jwt, indihomeNumber } = params;
  const payload = {
    indihome_number: indihomeNumber
  };
  const uri = `${config.get('/telkomBaseUrl')}/gateway/telkom-trems-billing/1.0/inquiry/inquiry`;
  const options = {
    uri,
    method: 'POST',
    auth: { bearer: jwt.data },
    body: payload,
    json: true
  };
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Check Inquiry Error');
    return wrapper.error(new InternalServerError('Check Inquiry Error'));
  }
};


module.exports = {
  checkCableType,
  getPelanggan,
  getPortofolio,
  getIboosterInfo,
  getDetailTeknisi,
  reportIssue,
  reportReopenIssue,
  getServiceTimesParallel,
  getServiceTechnicianPsbParallel,
  getAvailableTechnicianPsbService,
  getAvailableServiceTimes,
  checkInquiry,
  setReopenTicket
};
