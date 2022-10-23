const rp = require('request-promise');
const crypto = require('crypto');
const joi = require('joi');
const validate = require('validate.js');
const { BadRequestError,InternalServerError } = require('../error');
const wrapper = require('./wrapper');
const Redis = require('../databases/redis/redis');
const config = require('../../infra/configs/global_config');
const logger = require('../utils/logger');

const REDIS_CLIENT_CONFIGURATION = {
  connection : {
    host: config.get('/redisHost'),
    port: config.get('/redisPort'),
    password: config.get('/redisPassword')
  },
  index : config.get('/redisIndex')
};
const redisClient = new Redis(REDIS_CLIENT_CONFIGURATION);

const getLastFromURL = async (url) => {
  let name = decodeURI(url).split('/').pop();
  name = name.replace(/(\r\n|\n|\r)/gm, '');
  return String(name);
};

const encrypt = async (text, algorithm, secretKey) => {
  const cipher = crypto.createCipher(algorithm, secretKey);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

const decrypt = async (text, algorithm, secretKey) => {
  const decipher = crypto.createDecipher(algorithm, secretKey);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

const isValidPayload = (payload, constraint) => {
  const { value, error } = joi.validate(payload, constraint);
  if(!validate.isEmpty(error)){
    return wrapper.error(new BadRequestError(error));
  }
  return wrapper.data(value);

};

const getJwt = async () => {
  const ctx = 'common-getJwt';
  const options = {
    uri: `${config.get('/telkomBaseUrl')}/rest/pub/apigateway/jwt/getJsonWebToken?app_id=${config.get('/indihomeAppId')}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.get('/telkomAuth')
    },
    json: true
  };
  try {
    return await rp.get(options);
  } catch (error) {
    logger.error(ctx, 'error', 'Can not get legacy jwt token', error);
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const getJwtLegacy = async () => {
  const ctx = 'common-getJwtLegacy';
  const jwtObj = await redisClient.getData('MYINDIHOME-JWT');
  let dataJwt;
  if (validate.isEmpty(jwtObj) || validate.isEmpty(jwtObj.data)) {
    const jwt = await getJwt();
    if (jwt.err) {
      logger.error(ctx, 'error', 'Internal Server Error', jwt.err);
      return wrapper.error(new InternalServerError('Internal server error'));
    }
    dataJwt = jwt.jwt;
    await redisClient.setDataEx('MYINDIHOME-JWT', jwt, 24 * 60 * 60);
  } else {
    const jwtTemp = JSON.parse(jwtObj.data);
    dataJwt = jwtTemp.data.jwt;
  }
  return wrapper.data(dataJwt);
};

module.exports = {
  getLastFromURL,
  encrypt,
  decrypt,
  isValidPayload,
  getJwtLegacy,
  getJwt
};
