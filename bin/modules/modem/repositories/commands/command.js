
class Command {

  constructor(db) {
    this.db = db;
  }

  async insertOneModem(document){
    this.db.setCollection('modem');
    return this.db.insertOne(document);
  }

  async upsertOneModem(params,document){
    this.db.setCollection('modem');
    return this.db.upsertOne(params, document);
  }
}

module.exports = Command;
