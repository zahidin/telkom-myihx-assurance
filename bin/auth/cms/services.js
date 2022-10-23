
const rp = require('request-promise');
const config = require('../../infra/configs/global_config');
const { InternalServerError } = require('../../helpers/error');
const logger = require('../../helpers/utils/logger');
const wrapper = require('../../helpers/utils/wrapper');

const getCurrentUser = async (payload) => {
  const ctx = 'checkedZone';
  const options = {
    uri: `${config.get('/cmsOauth')}/api/users/v1`,
    headers: {
      'Authorization': `Bearer ${payload.token}`
    },
    json: true
  };
  try {
    const result = await rp.get(options);
    logger.info(ctx, 'success', 'Get current user success', result);
    return wrapper.data(result.data);
  } catch (error) {
    logger.error(ctx, 'fail', 'Get current user fail', error);
    return wrapper.error(new InternalServerError('Get current user fail'));
  }
};

module.exports = {
  getCurrentUser
};
