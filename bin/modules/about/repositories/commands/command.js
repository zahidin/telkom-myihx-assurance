class Command {

  constructor(db) {
    this.db = db;
  }

  async insertAbout(params){
    this.db.setCollection('about');
    const result = await this.db.insertOne(params);
    return result;
  }

  async upsertAbout(params, document){
    this.db.setCollection('about');
    const result = await this.db.upsertOne(params, document);
    return result;
  }

  async removeAbout(params){
    this.db.setCollection('about');
    const result = await this.db.deleteOne(params);
    return result;
  }

}

module.exports = Command;

