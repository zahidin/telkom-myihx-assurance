const validate = require('validate.js');
const wrapper = require('../../../helpers/utils/wrapper');
const queryHandler = require('../repositories/queries/query_handler');
const commandModel = require('../repositories/commands/command_model');
const commandHandler = require('../repositories/commands/command_handler');
const validator = require('../../../helpers/utils/validator');
const queryModel = require('../repositories/queries/query_model');
const { ERROR:httpError, SUCCESS:http } = require('../../../helpers/http-status/status_code');

const getTopicFaq = async (req, res) => {
  const getData = async () => queryHandler.getTopicFaq();
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get topic faq successfull', http.OK);
  };
  sendResponse(await getData());
};

const getFaq = async (req, res) => {
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const getData = async () => queryHandler.getFaq(lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get faq successfull', http.OK);
  };
  sendResponse(await getData());
};

const listTopicFaq = async (req, res) => {
  const getData = async () => queryHandler.listTopicFaq(req.query);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.paginationResponse(res, 'fail', result, 'Get list faq fail', httpError.NOT_FOUND)
      : wrapper.paginationResponse(res, 'success', result, 'Get list faq successfull', http.OK);
  };
  sendResponse(await getData());
};

const getTopicDetail = async (req, res) => {
  const { id } = req.params;
  const getData = async () => queryHandler.getTopicDetail(id);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get topic detail successful', http.OK);
  };
  sendResponse(await getData());
};

const postTopic = async (req, res) => {
  const payload = req.body;
  payload.iconMobile = req.files.iconMobile;
  payload.fileMobile = req.files.iconMobile.name;
  payload.iconMobileSize = req.files.iconMobile.size;
  payload.iconWebsite = req.files.iconWebsite;
  payload.fileWebsite = req.files.iconWebsite.name;
  payload.iconWebsiteSize = req.files.iconWebsite.size;
  payload.backgroundMobile = req.files.backgroundMobile;
  payload.fileBackgroundMobile = req.files.backgroundMobile.name;
  payload.backgroundMobileSize = req.files.backgroundMobile.size;
  payload.backgroundWebsite = req.files.backgroundWebsite;
  payload.fileBackgroundWebsite = req.files.backgroundWebsite.name;
  payload.backgroundWebsiteSize = req.files.backgroundWebsite.size;
  payload.creatorId = req.user.userId;
  payload.creatorName = req.user.fullName;
  const validatePayload = validator.isValidPayload(payload, commandModel.topic);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postTopic(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Topic FAQ fail')
      : wrapper.response(res, 'success', result, 'Topic FAQ success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const updateTopicList = async (req, res) => {
  const payload = req.body;
  payload.updatedId = req.user.userId;
  payload.updatedName = req.user.fullName;
  const validatePayload = validator.isValidPayload(payload, commandModel.onboardingSort);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateTopicList(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Update topic sort')
      : wrapper.response(res, 'success', result, 'Update topic sort', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const updateTopic = async (req, res) => {
  const payload = req.body;
  payload.iconMobile = req.files.iconMobile;
  payload.iconMobileSize = req.files.iconMobile ? req.files.iconMobile.size : 0;
  payload.iconWebsite = req.files.iconWebsite;
  payload.iconWebsiteSize = req.files.iconWebsite ? req.files.iconWebsite.size : 0;
  payload.backgroundMobile = req.files.backgroundMobile;
  payload.backgroundMobileSize = req.files.backgroundMobile ? req.files.backgroundMobile.size : 0;
  payload.backgroundWebsite = req.files.backgroundWebsite;
  payload.backgroundWebsiteSize = req.files.backgroundWebsite ? req.files.backgroundWebsite.size : 0;
  payload.updatedId = req.user.userId;
  payload.updatedName = req.user.fullName;
  const { topicId } = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.topicUpdate);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateTopic(topicId, result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'updated FAQ fail')
      : wrapper.response(res, 'success', result, 'updated FAQ success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const removeTopic = async (req, res) => {
  const payload = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.removeTopic);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }

    return commandHandler.removeTopic(result.data);
  };
  const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
    (result.err) ? wrapper.response(res, 'fail', result, 'Remove Topic FAQ fail')
      : wrapper.response(res, 'success', result, 'Remove Topic FAQ success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const getQuestion = async (req, res) => {
  const getData = async () => queryHandler.getQuestion(req.query);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.paginationResponse(res, 'fail', result, 'Get list question fail', httpError.NOT_FOUND)
      : wrapper.paginationResponse(res, 'success', result, 'Get list question successfull', http.OK);
  };
  sendResponse(await getData());
};

const getQuestionDetail = async (req, res) => {
  const { id } = req.params;
  const getData = async () => queryHandler.getQuestionDetail(id);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get question detail successful', http.OK);
  };
  sendResponse(await getData());
};

const postQuestion = async (req, res) => {
  const payload = req.body;
  payload.creatorId = req.user.userId;
  payload.creatorName = req.user.fullName;
  const validatePayload = validator.isValidPayload(payload, commandModel.question);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postQuestion(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Insert FAQ question fail')
      : wrapper.response(res, 'success', result, 'Insert FAQ question success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const updateQuestion = async (req, res) => {
  const payload = req.body;
  payload.updatedId = req.user.userId;
  payload.updatedName = req.user.fullName;
  const { id } = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.questionUpdate);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateQuestion(id, result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'updated FAQ question fail')
      : wrapper.response(res, 'success', result, 'updated FAQ question success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const removeQuestion = async (req, res) => {
  const payload = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.removeQuestion);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.removeQuestion(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'remove FAQ question fail')
      : wrapper.response(res, 'success', result, 'remove FAQ question uccess', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const searchAnswer = async (req, res) => {
  const payload = req.query;
  const validatePayload = validator.isValidPayload(payload, queryModel.searchAnswerModel);
  const getData = async (result) => {
    if (result.err) {
      return result;
    }
    return queryHandler.searchAnswer(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Search result', http.OK);
  };
  sendResponse(await getData(validatePayload));
};

const getAnswers = async (req, res) => {
  const getData = async () => queryHandler.getAnswers(req.query);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.paginationResponse(res, 'fail', result, 'Get Banner successful', httpError.NOT_FOUND)
      : wrapper.paginationResponse(res, 'success', result, 'Get list answers successfull', http.OK);
  };
  sendResponse(await getData());
};

const getAnswerDetail = async (req, res) => {
  const { id } = req.params;
  const getData = async () => queryHandler.getAnswerDetail(id);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get answer detail successful', http.OK);
  };
  sendResponse(await getData());
};

const postAnswer = async (req, res) => {
  const payload = req.body;
  payload.creatorId = req.user.userId;
  payload.creatorName = req.user.fullName;
  const validatePayload = validator.isValidPayload(payload, commandModel.answer);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postAnswer(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Insert FAQ question fail')
      : wrapper.response(res, 'success', result, 'Insert FAQ question success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const updateAnswer = async (req, res) => {
  const payload = req.body;
  payload.updatedId = req.user.userId;
  payload.updatedName = req.user.fullName;
  const { id } = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.answerUpdate);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateAnswer(id, result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'updated FAQ answer fail')
      : wrapper.response(res, 'success', result, 'updated FAQ answer success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const removeAnswer = async (req, res) => {
  const payload = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.removeAnswer);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.removeAnswer(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'remove FAQ answer fail')
      : wrapper.response(res, 'success', result, 'remove FAQ answer success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const removeListAnswer = async (req, res) => {
  const payload = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.removeListAnswer);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.removeListAnswer(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'remove FAQ question answer fail')
      : wrapper.response(res, 'success', result, 'remove FAQ question answer success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const updatedListAnswer = async (req, res) => {
  const payload = req.body;
  payload.updatedId = req.user.userId;
  payload.updatedName = req.user.fullName;
  const validatePayload = validator.isValidPayload(payload, commandModel.questionSort);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updatedListAnswer(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Update question answers list')
      : wrapper.response(res, 'success', result, 'Update question answers list', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const getFaqQuestion = async (req, res) => {
  const { topicId } = req.params;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const getData = async () => queryHandler.getFaqQuestion(topicId, lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get faq question category successfull', http.OK);
  };
  sendResponse(await getData());
};

const searchFaq = async (req, res) => {
  const payload = req.query;
  payload.lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const validatePayload = validator.isValidPayload(payload, queryModel.searchModel);
  const getData = async (result) => {
    if (result.err) {
      return result;
    }
    return queryHandler.searchFaq(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Search result', http.OK);
  };
  sendResponse(await getData(validatePayload));
};

const getFaqQuestionDetail = async (req, res) => {
  const { questionId } = req.params;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const getData = async () => queryHandler.getFaqQuestionDetail(questionId, lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get faq category successfull', http.OK);
  };
  sendResponse(await getData());
};

const getFaqSubCategory = async (req, res) => {
  const params = req.params;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const getData = async () => queryHandler.getFaqSubCategory(params, lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get faq sub category successfull', http.OK);
  };
  sendResponse(await getData());
};

const getTroubleshooting = async (req, res) => {
  const payload = req.params;
  payload.userId = req.userId;
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'in': req.headers['accept-language'];
  const validatePayload = validator.isValidPayload(payload, queryModel.getFaq);
  const getData = async (result) => {
    if (result.err) {
      return result;
    }
    return queryHandler.getTroubleshooting(payload, lang);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get faq troubleshoot successfull', http.OK);
  };
  sendResponse(await getData( validatePayload ));
};

const getQuestionBySubCategoryInformation = async (req, res) => {
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const getData = async () => queryHandler.getQuestionBySubCategoryInformation(lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get faq question sub category information successfull', http.OK);
  };
  sendResponse(await getData());
};

module.exports = {
  getTopicDetail,
  getAnswerDetail,
  getQuestionDetail,
  getTopicFaq,
  postTopic,
  updateTopicList,
  updateTopic,
  removeTopic,
  getQuestion,
  postQuestion,
  updateQuestion,
  removeQuestion,
  searchAnswer,
  getAnswers,
  updateAnswer,
  postAnswer,
  removeAnswer,
  removeListAnswer,
  updatedListAnswer,
  getFaq,
  listTopicFaq,
  getFaqQuestion,
  getFaqQuestionDetail,
  getFaqSubCategory,
  getTroubleshooting,
  searchFaq,
  getQuestionBySubCategoryInformation
};
