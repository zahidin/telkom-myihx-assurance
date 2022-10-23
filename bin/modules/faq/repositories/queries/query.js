class Query {

  constructor(db) {
    this.db = db;
  }

  async find(parameter) {
    this.db.setCollection('question');
    return await this.db.findMany(parameter);
  }

  async findManySort(parameter) {
    this.db.setCollection('topic-faq');
    const recordset = await this.db.findManySort(parameter);
    return recordset;
  }

  async findAllTopic(fieldName, row, page, param) {
    this.db.setCollection('topic-faq');
    const recordset = await this.db.findAllDataMultiSort(fieldName, row, page, param);
    return recordset;
  }

  async countOnboarding(param) {
    this.db.setCollection('topic-faq');
    const recordset = await this.db.countData(param);
    return recordset;
  }

  async findAllQuestion(parameter) {
    this.db.setCollection('question');
    return await this.db.findMany(parameter);
  }

  async findQuestionOne(parameter) {
    this.db.setCollection('question');
    return await this.db.findOne(parameter);
  }

  async findQuestion(fieldName, row, page, param) {
    this.db.setCollection('question');
    const recordset = await this.db.findAllData(fieldName, row, page, param);
    return recordset;
  }

  async aggregateQuestion(params){
    this.db.setCollection('question');
    const recordset = await this.db.aggregateData(params);
    return recordset;
  }

  async countQuestion(param) {
    this.db.setCollection('question');
    const recordset = await this.db.countData(param);
    return recordset;
  }

  async findAggregate(parameter) {
    this.db.setCollection('counter-faq');
    return await this.db.findAggregateData(parameter, 'count', 10);
  }

  async findAnswer(parameter) {
    this.db.setCollection('answer');
    return await this.db.findMany(parameter);
  }

  async findAnswerOne(parameter) {
    this.db.setCollection('answer');
    return await this.db.findOne(parameter);
  }

  async findAllAnswer(fieldName, row, page, param) {
    this.db.setCollection('answer');
    const recordset = await this.db.findAllData(fieldName, row, page, param);
    return recordset;
  }

  async countAnswer(param) {
    this.db.setCollection('answer');
    const recordset = await this.db.countData(param);
    return recordset;
  }

  async findAll(params) {
    this.db.setCollection('topic-faq');
    const recordset = await this.db.findMany(params);
    return recordset;
  }

  async findAssurance(parameter) {
    this.db.setCollection('assurance');
    return await this.db.findMany(parameter);
  }

  async findAssuranceSort(parameter) {
    this.db.setCollection('assurance');
    return await this.db.findManySortByScore(parameter);
  }

  async createIndex() {
    this.db.setCollection('assurance');
    return await this.db.createIndex();
  }

  async findTopic(parameter) {
    this.db.setCollection('topic-faq');
    return await this.db.findOne(parameter);
  }

  async findTopicFaq(params) {
    this.db.setCollection('topic-faq');
    return await this.db.findOne(params);
  }

  async findPSB(parameter) {
    this.db.setCollection('book-reserve');
    return await this.db.findOne(parameter);
  }

  async findManyAccount(parameter) {
    this.db.setCollection('accounts');
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }
}

module.exports = Query;
