const wrapper = require('../../../helpers/utils/wrapper');
const commandHandler = require('../repositories/commands/command_handler');
const commandModel = require('../repositories/commands/command_model');
const queryHandler = require('../repositories/queries/query_handler');
const validator = require('../../../helpers/utils/validator');
const validate = require('validate.js');
const { SUCCESS:http } = require('../../../helpers/http-status/status_code');


const about = async (req, res) => {
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const getData = async () => queryHandler.about(lang);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get list about successfull', http.OK);
  };
  sendResponse(await getData());
};

const getAbout = async (req, res) => {
  const lang = ( validate.isEmpty(req.headers['accept-language']) )? 'id': req.headers['accept-language'];
  const getData = async () => queryHandler.getAbout(lang, req.query);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get list about successfull', http.OK);
  };
  sendResponse(await getData());
};

const getAboutId = async (req, res) => {
  const getData = async () => queryHandler.getAboutId(req.params);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result)
      : wrapper.response(res, 'success', result, 'Get list about successfull', http.OK);
  };
  sendResponse(await getData());
};


const postAbout = async (req, res) => {
  const payload = req.body;
  payload.iconMobile = req.files.iconMobile;
  payload.fileIconMobile = req.files.iconMobile.name;
  payload.sizeIconMobile = req.files.iconMobile.size;
  payload.iconWebsite = req.files.iconWebsite;
  payload.fileIconWebsite = req.files.iconWebsite.name;
  payload.sizeIconWebsite = req.files.iconWebsite.size;
  payload.creatorId = req.user.userId;
  payload.creatorName = req.user.fullName;
  payload.socialMediaWebsite = req.files.socialMediaWebsite;
  payload.socialMediaMobile = req.files.socialMediaMobile;

  const validatePayload = validator.isValidPayload(payload, commandModel.postAbout);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postAbout(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'About fail')
      : wrapper.response(res, 'success', result, 'About success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const updateAbout = async (req, res) => {
  const payload = req.body;
  payload.iconMobile = req.files.iconMobile;
  payload.iconWebsite = req.files.iconWebsite;
  payload.updatedId = req.user.userId;
  payload.updatedName = req.user.fullName;
  payload.socialMediaWebsite = req.files.socialMediaWebsite;
  payload.socialMediaMobile = req.files.socialMediaMobile;
  payload.id = req.params.id;
  const { id } = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.updateAbout);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateAbout(id, result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Social Media fail')
      : wrapper.response(res, 'success', result, 'Social Media success', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const removeAbout = async (req,res) => {
  const payload = req.params;
  const validatePayload = validator.isValidPayload(payload, commandModel.removeAbout);
  const delRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.removeAbout(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Delete banner movie successful')
      : wrapper.response(res, 'success', result, 'Delete banner movie successful', http.OK);
  };
  sendResponse(await delRequest(validatePayload));
};


module.exports = {
  postAbout,
  updateAbout,
  getAbout,
  getAboutId,
  removeAbout,
  about
};
