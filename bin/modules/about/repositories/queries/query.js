class Query {

  constructor(db) {
    this.db = db;
  }

  async findAbout(parameter) {
    this.db.setCollection('about');
    return await this.db.findMany(parameter);
  }

  async findOneAbout(parameter) {
    this.db.setCollection('about');
    return await this.db.findOne(parameter);
  }

  async findAllAbout(fieldName, row, page, param) {
    this.db.setCollection('about');
    const recordset = await this.db.findAllData(fieldName, row, page, param);
    return recordset;
  }

  async countAbout(param) {
    this.db.setCollection('about');
    const recordset = await this.db.countData(param);
    return recordset;
  }
}

module.exports = Query;

