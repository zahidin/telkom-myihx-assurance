const joi = require('joi');

const ticket = joi.object({
  userId: joi.string().required(),
  issueId: joi.string().required(),
  type: joi.string().required(),
  message : joi.string().optional().allow(''),
  lang: joi.string().required()
});

const updateTicket = joi.object({
  transactionId: joi.string().required(),
  ticketId: joi.string().required()
});

const statusTicket = joi.object({
  transactionId: joi.string().required(),
  ticketId: joi.string().optional().allow(''),
  status : joi.string().valid(['IN_PROGRESS','COMPLETED','RESOLVED']).required()
});

const requestSchedule = joi.object({
  userId: joi.string().required(),
  bookingId: joi.string().required(),
  schedule: joi.object({
    slotId: joi.string().required(),
    slot: joi.string().required(),
    time: joi.string().required(),
    date: joi.string().required()
  }).required(),
  crewId: joi.string().required(),
  information: joi.string().optional().allow(''),
  contactSecondary: joi.object({
    fullName: joi.string().optional().allow(''),
    mobileNumber: joi.string().min(8).max(15).regex(/^(\+62|62|0)/).optional().allow('')
  }).optional().allow('')
});

const requestReSchedule = joi.object({
  userId: joi.string().required(),
  issueId: joi.string().required(),
  bookingId: joi.string().required(),
  schedule: joi.object({
    slotId: joi.string().required(),
    slot: joi.string().required(),
    time: joi.string().required(),
    date: joi.string().required()
  }).required(),
  crewId: joi.string().required(),
  information: joi.string().optional().allow(''),
  contactSecondary: joi.object({
    fullName: joi.string().optional().allow(''),
    mobileNumber: joi.string().min(8).max(15).regex(/^(\+62|62|0)/).optional().allow('')
  }).optional().allow('')
});

const addComments = joi.object({
  issueId: joi.string().required(),
  comment : joi.string().optional().allow('')
});

const reopenTicket = joi.object({
  userId: joi.string().required(),
  transactionId: joi.string().required(),
  message: joi.string().optional().allow('')
});

const issue = () => {
  const model = {
    issueId: '',
    assetNum: '',
    psbAccount:{
      indihomeNumber: '',
      ncli: '',
      telephoneNumber: '',
      sto: '',
      address: ''
    },
    userId: '',
    symptom: {},
    issueType: '',
    ticketType: '',
    message: '',
    status: '',
    schedule: {},
    ticketId: '',
    technician: {},
    work: '',
    comments: [],
    createdAt: '',
    lastModified: ''
  };
  return model;
};

const schedule = () => {
  const model = {
    bookingId: '',
    scheduleAttempt: 0,
    timeBox: new Date(),
    timeSlot: '',
    availability: '',
    crewId: '',
    information: '',
    contactSecondary: ''
  };
  return model;
};

const responseResult = () => {
  return {
    indihomeNum: '',
    status: '',
    amount: 0,
    title: '',
    description:''
  };
};

module.exports = {
  ticket,
  requestSchedule,
  requestReSchedule,
  statusTicket,
  updateTicket,
  addComments,
  reopenTicket,
  schedule,
  responseResult,
  issue,
};
