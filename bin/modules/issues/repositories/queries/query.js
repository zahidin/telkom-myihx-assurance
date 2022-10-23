class Query {

  constructor(db) {
    this.db = db;
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

  async findOneUser(parameter) {
    this.db.setCollection('users');
    return await this.db.findOne(parameter);
  }

  async findAssurance(parameter) {
    this.db.setCollection('assurance');
    return await this.db.findOne(parameter);
  }

  async findIssue(parameter) {
    this.db.setCollection('issues');
    return await this.db.findOne(parameter);
  }

  async findIssues(parameter) {
    this.db.setCollection('issues');
    return await this.db.findMany(parameter);
  }

  async findSymptom(parameter) {
    this.db.setCollection('symptoms');
    return await this.db.findOne(parameter);
  }

  async findAll(params) {
    this.db.setCollection('assurance');
    const recordset = await this.db.aggregateData(params);
    return recordset;
  }

  async getIssuesByType(type) {
    this.db.setCollection('assurance');
    const parameter = {
      type: type
    };
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }

  async getIssuesId(params) {
    const parameter = {
      symptomId: params
    };
    this.db.setCollection('assurance');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOneModem(parameter) {
    this.db.setCollection('modem');
    return this.db.findOne(parameter);
  }

}

module.exports = Query;
