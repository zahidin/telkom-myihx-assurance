const Issue = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const issue = new Issue(db);

const getCategories = async (lang) => {
  const getData = async () => {
    return await issue.getCategories(lang);
  };
  const result = await getData();
  return result;
};

const getIssuesByType = async (categoryId, lang) => {
  const getData = async () => {
    return await issue.getIssuesByType(categoryId, lang);
  };
  const result = await getData();
  return result;
};

const getIssuesId = async (categoryId, lang) => {
  const getData = async () => {
    return await issue.getIssuesId(categoryId, lang);
  };
  const result = await getData();
  return result;
};

const getScheduleAvailability = async (userId,lang) => {
  const getData = async () => {
    return await issue.getScheduleAvailability(userId,lang);
  };
  const result = await getData();
  return result;
};

const reopenTechnician = async (userId,lang) => {
  const getData = async () => {
    return await issue.reopenTechnician(userId,lang);
  };
  const result = await getData();
  return result;
};

const getTicketDetails = async (payload) => {
  const getData = async () => {
    return await issue.getTicketDetails(payload);
  };
  const result = await getData();
  return result;
};

const rescheduleTicket = async (payload) => {
  const getData = async () => {
    return await issue.rescheduleTicket(payload);
  };
  const result = await getData();
  return result;
};

const getCommentByIssueId = async (issueId) => {
  const getData = async () => {
    return await issue.getCommentByIssueId(issueId);
  };
  const result = await getData();
  return result;
};

module.exports = {
  getCategories,
  rescheduleTicket,
  getIssuesByType,
  getScheduleAvailability,
  reopenTechnician,
  getTicketDetails,
  getIssuesId,
  getCommentByIssueId
};
