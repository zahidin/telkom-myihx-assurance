const apm = require('elastic-apm-node');
const config = require('../../../infra/configs/global_config');

const init = () => {
  apm.start({
    serviceName: config.get('/apm/serviceName'),
    secretToken: config.get('/apm/secretToken'),
    serverUrl: config.get('/apm/serverUrl'),
  });
};

module.exports = {
  init
};
