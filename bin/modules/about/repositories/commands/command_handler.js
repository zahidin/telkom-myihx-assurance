const About = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));

const postAbout = async (payload) => {
  const about = new About(db);
  const postCommand = async payload => about.postAbout(payload);
  return postCommand(payload);
};

const updateAbout = async (id, payload) => {
  const about = new About(db);
  const updateCommand = async (id, payload) => about.updateAbout(id, payload);
  return updateCommand(id, payload);
};

const removeAbout = async (payload) => {
  const about = new About(db);
  const removeCommand = async (payload) => about.removeAbout(payload);
  return removeCommand(payload);
};


module.exports = {
  postAbout,
  updateAbout,
  removeAbout
};
