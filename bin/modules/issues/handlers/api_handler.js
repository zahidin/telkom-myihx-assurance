const validate = require('validate.js');
const validator = require('../../../helpers/utils/common');
const wrapper = require('../../../helpers/utils/wrapper');
const commandHandler = require('../repositories/commands/command_handler');
const commandModel = require('../repositories/commands/command_model');
const queryModel = require('../repositories/queries/query_model');
const queryHandler = require('../repositories/queries/query_handler');
const { SUCCESS:http } = require('../../../helpers/http-status/status_code');

const getAllCategories = async (req, res) => {
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'en': req.headers['accept-language'];
  const getData = async () => queryHandler.getCategories(lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get categories successfull', http.OK);
  };
  sendResponse(await getData());
};

const createTicket = async (req, res) => {
  const payload = req.body;
  payload.userId = req.userId;
  payload.lang = ( validate.isEmpty(req.headers['accept-language']) )? 'en': req.headers['accept-language'];
  const validatePayload = validator.isValidPayload(payload, commandModel.ticket);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.createTicketIssue(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Create Ticket Issue', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const postSchedule = async (req, res) => {
  const payload = req.body;
  payload.userId = req.userId;
  const validatePayload = validator.isValidPayload(payload, commandModel.requestSchedule);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postScheduleIssue(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Create Ticket Issue', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const postReopenSchedule = async (req, res) => {
  const payload = req.body;
  payload.userId = req.userId;
  const validatePayload = validator.isValidPayload(payload, commandModel.requestSchedule);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postReopenSchedule(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Create Ticket Issue', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const getIssuesByType = async (req, res) =>  {
  const { type } = req.params;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'en': req.headers['accept-language'];
  const getData = async () => queryHandler.getIssuesByType(type, lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get categories by type successfull', http.OK);
  };
  sendResponse(await getData());
};

const getIssuesById = async (req, res) => {
  const { issueId } = req.params;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'en': req.headers['accept-language'];
  const getData = async () => queryHandler.getIssuesId(issueId, lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get categories by type successfull', http.OK);
  };
  sendResponse(await getData());
};

const scheduleAvailability = async (req, res) => {
  const { userId } = req;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'en': req.headers['accept-language'];
  const getData = async () => queryHandler.getScheduleAvailability(userId,lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get schedule availability successfull', http.OK);
  };
  sendResponse(await getData());
};

const reopenTechnician = async (req, res) => {
  const { userId } = req;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'en': req.headers['accept-language'];
  const getData = async () => queryHandler.reopenTechnician(userId,lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get schedule reopen availability successfull', http.OK);
  };
  sendResponse(await getData());
};

const getTicketDetails = async (req, res) => {
  const payload  = req.params;
  payload.userId = req.userId;
  payload.lang   = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const validatePayload = validator.isValidPayload(payload, queryModel.getTicketByIssueId);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return queryHandler.getTicketDetails(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get schedule detail successfull', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

const getRescheduleTicket = async (req, res) => {
  const payload  = req.params;
  payload.userId = req.userId;
  payload.lang   = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const validatePayload = validator.isValidPayload(payload, queryModel.getTicketByIssueId);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return queryHandler.rescheduleTicket(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get schedule detail successfull', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

const rescheduleTicket = async (req, res) => {
  const payload  = req.body;
  payload.userId = req.userId;
  payload.issueId = req.params.issueId;
  const validatePayload = validator.isValidPayload(payload, commandModel.requestReSchedule);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.rescheduleTicket(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Save new schedule successfull', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

const updateTicketId = async (req, res) => {
  const payload  = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.updateTicket);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateTicketId(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Successfully updated ticketId successfull', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

const updateStatusTicket = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.statusTicket);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateStatusTicket(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Updated ticket status successfully', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

const comment = async (req, res) => {
  const { issueId } = req.params;
  const getData = async () => queryHandler.getCommentByIssueId(issueId);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get comments by issues successfull', http.OK);
  };
  sendResponse(await getData());
};

const addComment = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.addComments);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.addComment(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Comment received', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

const reopenTicket = async (req, res) => {
  const payload = req.body;
  payload.userId = req.userId;

  const validatePayload = validator.isValidPayload(payload, commandModel.reopenTicket);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.reopenTicket(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'ticket updated', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

const closeTicket = async (req, res) => {
  const payload = req.body;
  payload.userId = req.userId;

  const validatePayload = validator.isValidPayload(payload, commandModel.reopenTicket);
  const getRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.closeTicket(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'ticket updated', http.OK);
  };
  sendResponse(await getRequest(validatePayload));
};

module.exports = {
  getAllCategories,
  rescheduleTicket,
  createTicket,
  getIssuesByType,
  getIssuesById,
  postSchedule,
  postReopenSchedule,
  getTicketDetails,
  updateStatusTicket,
  updateTicketId,
  scheduleAvailability,
  reopenTechnician,
  comment,
  addComment,
  reopenTicket,
  closeTicket,
  getRescheduleTicket
};
