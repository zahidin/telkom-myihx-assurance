
class Command {

  constructor(db) {
    this.db = db;
  }

  async insertIssue(document){
    this.db.setCollection('issues');
    const result = await this.db.insertOne(document);
    return result;
  }

  async upsertIssues(params,document){
    this.db.setCollection('issues');
    const result = await this.db.upsertOne(params, document);
    return result;
  }

  async insertComment(document){
    this.db.setCollection('comments');
    const result = await this.db.insertOne(document);
    return result;
  }

}

module.exports = Command;
