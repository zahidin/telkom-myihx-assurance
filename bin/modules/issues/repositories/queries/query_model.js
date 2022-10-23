const joi = require('joi');

const getTicketByIssueId = joi.object({
  userId: joi.string().required(),
  issueId: joi.string().required(),
  lang: joi.string().required()
});

const assuranceModel = () => {
  const model = {
    categoryId: '',
    name: '',
  };
  return model;
};

const issuesModel = () => {
  const model = {
    symptomId: '',
    category: '',
    issueType: '',
    issues: '',
    technicalLanguage: '',
    fiber: '',
    cooper: '',
  };
  return model;
};

const availableService = () => {
  const model = {
    timeBox: '',
    timeInSeconds: '',
    issueId: '',
    sto: '',
    indihomeNumber: '',
    issueSummary: '',
    technicalLanguage: '',
    message: '',
    address: {},
    schedule: {}
  };
  return model;
};

const detailTicket = () => {
  const model = {
    issueId: '',
    issueSummary: {},
    technicalLanguage: '',
    message: '',
    type: '',
    category: '',
    address: {},
    schedule: {},
    technician: {},
    progress: {}
  };
  return model;
};

const commentsModel = () => {
  const model = {
    message: '',
    date: '',
  };
  return model;
};

module.exports = {
  assuranceModel,
  availableService,
  issuesModel,
  detailTicket,
  commentsModel,
  getTicketByIssueId
};
