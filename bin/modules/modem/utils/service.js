const rp = require('request-promise');
const config = require('../../../infra/configs/global_config');
const { InternalServerError } = require('../../../helpers/error');
const logger = require('../../../helpers/utils/logger');
const wrapper = require('../../../helpers/utils/wrapper');

const checkIbooster = async (parameter) => {
  const ctx = 'service-checkIbooster';
  const { indihomeNumber, realm, jwt } = parameter;
  const payload = {
    input: {
      nd: indihomeNumber,
      realm
    }
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/ws/ibooster/1.0/ukur`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return wrapper.data(result);
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

const resetModem = async (parameter) => {
  const ctx = 'service-resetModem';
  const { indihomeNumber, realm, jwt } = parameter;
  const payload = {
    nd: indihomeNumber,
    realm
  };
  const options = {
    method: 'POST',
    uri: `${config.get('/telkomBaseUrl')}/gateway/telkom-ibooster-ukur/1.0/restartNTE`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: payload,
    json: true
  };
  try {
    const result = await rp.post(options);
    logger.log(ctx, JSON.stringify(result), 'result');
    return wrapper.data(result);
  } catch (error) {
    logger.log(ctx, error, 'Internal server error');
    return wrapper.error(new InternalServerError('Internal server error'));
  }
};

module.exports = {
  checkIbooster,
  resetModem
};
