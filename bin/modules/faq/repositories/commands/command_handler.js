const Topic = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));

const postTopic = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.postTopic(payload);
  return postCommand(payload);
};

const updateTopicList = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.updateTopicList(payload);
  return postCommand(payload);
};

const updateTopic = async (topicId, payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.updateTopic(topicId, payload);
  return postCommand(payload);
};

const removeTopic = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async (payload) => topic.removeTopic(payload);
  return postCommand(payload);
};

const postQuestion = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.postQuestion(payload);
  return postCommand(payload);
};

const updateQuestion = async (questionId, payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.updateQuestion(questionId, payload);
  return postCommand(payload);
};

const removeQuestion = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async (payload) => topic.removeQuestion(payload);
  return postCommand(payload);
};

const updatedListAnswer = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.updatedListAnswer(payload);
  return postCommand(payload);
};

const postAnswer = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.postAnswer(payload);
  return postCommand(payload);
};

const updateAnswer = async (id, payload) => {
  const topic = new Topic(db);
  const postCommand = async payload => topic.updateAnswer(id, payload);
  return postCommand(payload);
};

const removeAnswer = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async (payload) => topic.removeAnswer(payload);
  return postCommand(payload);
};

const removeListAnswer = async (payload) => {
  const topic = new Topic(db);
  const postCommand = async (payload) => topic.removeListAnswer(payload);
  return postCommand(payload);
};

module.exports = {
  postTopic,
  updateTopicList,
  updateTopic,
  removeTopic,
  postQuestion,
  updatedListAnswer,
  postAnswer,
  updateQuestion,
  removeQuestion,
  updateAnswer,
  removeAnswer,
  removeListAnswer
};
