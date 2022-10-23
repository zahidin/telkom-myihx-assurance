
const Faq = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const faq = new Faq(db);

const getTopicFaq = async () => {
  const getData = async () => {
    return await faq.getTopicFaq();
  };
  const result = await getData();
  return result;
};

const getFaq = async (lang) => {
  const getData = async () => {
    return await faq.getFaq(lang);
  };
  const result = await getData();
  return result;
};

const listTopicFaq = async (payload) => {
  const getData = async () => {
    return await faq.listTopicFaq(payload);
  };
  const result = await getData();
  return result;
};

const getTopicDetail = async (id) => {
  const getData = async () => {
    return await faq.getTopicDetail(id);
  };
  const result = await getData();
  return result;
};

const getAnswers = async (payload) => {
  const getData = async () => {
    return await faq.getAnswers(payload);
  };
  const result = await getData();
  return result;
};

const getAnswerDetail = async (id) => {
  const getData = async () => {
    return await faq.getAnswerDetail(id);
  };
  const result = await getData();
  return result;
};

const getQuestion = async (payload) => {
  const getData = async () => {
    return await faq.getQuestion(payload);
  };
  const result = await getData();
  return result;
};

const getFaqQuestion = async (topicId, lang) => {
  const getData = async () => {
    return await faq.getFaqQuestion(topicId, lang);
  };
  const result = await getData();
  return result;
};

const getFaqQuestionDetail = async (questionId, lang) => {
  const getData = async () => {
    return await faq.getFaqQuestionDetail(questionId, lang);
  };
  const result = await getData();
  return result;
};

const getQuestionDetail = async (id) => {
  const getData = async () => {
    return await faq.getQuestionDetail(id);
  };
  const result = await getData();
  return result;
};

const searchFaq = async (payload) => {
  const getData = async () => {
    return await faq.searchFaq(payload);
  };
  const result = await getData();
  return result;
};

const searchAnswer = async (payload) => {
  const getData = async () => {
    return await faq.searchAnswer(payload);
  };
  const result = await getData();
  return result;
};

const getFaqSubCategory = async (params, lang) => {
  const getData = async () => {
    return await faq.getFaqSubCategory(params, lang);
  };
  const result = await getData();
  return result;
};

const getTroubleshooting = async (params, lang) => {
  const getData = async () => {
    return await faq.getTroubleshooting(params, lang);
  };
  const result = await getData();
  return result;
};

const getQuestionBySubCategoryInformation = async (lang) => {
  const getData = async () => {
    return await faq.getQuestionBySubCategoryInformation(lang);
  };
  const result = await getData();
  return result;
};

module.exports = {
  getTopicFaq,
  getFaq,
  getTopicDetail,
  searchFaq,
  getAnswerDetail,
  searchAnswer,
  listTopicFaq,
  getAnswers,
  getQuestion,
  getFaqQuestion,
  getQuestionDetail,
  getFaqQuestionDetail,
  getFaqSubCategory,
  getTroubleshooting,
  getQuestionBySubCategoryInformation
};
