class Query {

  constructor(db) {
    this.db = db;
  }

  async findOneModem(parameter) {
    this.db.setCollection('modem');
    return this.db.findOne(parameter);
  }

}

module.exports = Query;
