
const ObjectId = require('mongodb').ObjectId;

class Query {

  constructor(db) {
    this.db = db;
  }

  async findOneUser(parameter) {
    this.db.setCollection('users');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOneAccount(parameter) {
    this.db.setCollection('accounts');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findIssue(parameter) {
    this.db.setCollection('issue');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findById(id) {
    this.db.setCollection('user');
    const parameter = {
      _id: ObjectId(id)
    };
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

}

module.exports = Query;
