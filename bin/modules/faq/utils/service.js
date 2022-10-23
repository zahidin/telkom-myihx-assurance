const rp = require('request-promise');
const config = require('../../../infra/configs/global_config');
const { InternalServerError } = require('../../../helpers/error');
const logger = require('../../../helpers/utils/logger');
const wrapper = require('../../../helpers/utils/wrapper');

const checkGamas = async (params) => {
  const ctx = 'service-checkGamas';
  const { jwt, body } = params;
  const uri = `${config.get('/telkomBaseUrl')}/gateway/telkom-oss-gamas/1.0/checkGamasAlert`;
  const options = {
    uri,
    method: 'POST',
    auth: { bearer: jwt },
    body: body,
    json: true
  };
  logger.log(ctx, JSON.stringify(options), 'params');
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Check Gamas Error');
    return wrapper.error(new InternalServerError('Check Gamas Error'));
  }
};

const checkIsolir = async (params) => {
  const ctx = 'service-checkIsolir';
  const { jwt, body } = params;
  const uri = `${config.get('/telkomBaseUrl')}/ws/telkom-ncx-checkND/1.0/checkND`;
  const options = {
    uri,
    method: 'POST',
    auth: { bearer: jwt },
    body: body,
    json: true
  };
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return result;
  } catch (error) {
    logger.log(ctx, error, 'Check Isolir Error');
    return wrapper.error(new InternalServerError('Check Isolir Error'));
  }
};

const checkInquiry = async (params) => {
  const ctx = 'service-checkInquiry';
  const { jwt, body } = params;
  const uri = `${config.get('/telkomBaseUrl')}/gateway/telkom-trems-billing/1.0/inquiry/inquiry`;
  const options = {
    uri,
    method: 'POST',
    auth: { bearer: jwt },
    body: body,
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

const getPelanggan = async (parameter) => {
  const ctx = 'service-getPelanggan';
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

module.exports = {
  checkIsolir,
  getPelanggan,
  checkInquiry,
  checkGamas
};
