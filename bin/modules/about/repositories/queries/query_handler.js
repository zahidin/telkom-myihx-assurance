
const About = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));

const about = async (lang) => {
  const about = new About(db);
  const getData = async () => {
    return await about.about(lang);
  };
  const result = await getData();
  return result;
};

const getAbout = async (lang, payload) => {
  const about = new About(db);
  const getData = async () => {
    return await about.getAbout(lang, payload);
  };
  const result = await getData();
  return result;
};

const getAboutId = async (payload) => {
  const about = new About(db);
  const getData = async () => {
    return await about.getAboutId(payload);
  };
  const result = await getData();
  return result;
};

module.exports = {
  getAbout,
  getAboutId,
  about
};
