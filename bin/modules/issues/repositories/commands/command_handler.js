
const Issue = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));

const createTicketIssue = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.createTicketIssue(payload);
  return postCommand(payload);
};

const postScheduleIssue = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.postScheduleIssue(payload);
  return postCommand(payload);
};

const postReopenSchedule = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.postReopenScheduleIssue(payload);
  return postCommand(payload);
};

const updateTicketId = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.updateTicketId(payload);
  return postCommand(payload);
};

const updateStatusTicket = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.updateStatusTicket(payload);
  return postCommand(payload);
};

const addComment = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.addComment(payload);
  return postCommand(payload);
};

const reopenTicket = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.reopenTicket(payload);
  return postCommand(payload);
};

const rescheduleTicket = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.rescheduleTicket(payload);
  return postCommand(payload);
};

const closeTicket = async (payload) => {
  const issue = new Issue(db);
  const postCommand = async payload => issue.closeTicket(payload);
  return postCommand(payload);
};

module.exports = {
  createTicketIssue,
  updateTicketId,
  updateStatusTicket,
  postScheduleIssue,
  postReopenSchedule,
  addComment,
  reopenTicket,
  closeTicket,
  rescheduleTicket
};
