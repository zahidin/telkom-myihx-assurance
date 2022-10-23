
const Modem = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));

const resetModem = async (userId) => {
  const modem = new Modem(db);
  const postCommand = async () => modem.resetModem(userId);
  return postCommand();
};

module.exports = {
  resetModem
};
