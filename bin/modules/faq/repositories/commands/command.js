class Command {

  constructor(db) {
    this.db = db;
  }

  async insertTopicFaq(topic){
    this.db.setCollection('topic-faq');
    const result = await this.db.insertOne(topic);
    return result;
  }

  async upsertTopic(params, document){
    this.db.setCollection('topic-faq');
    const result = await this.db.upsertOne(params, document);
    return result;
  }

  async removeTopic(params){
    this.db.setCollection('topic-faq');
    const result = await this.db.deleteOne(params);
    return result;
  }

  async insertQuestion(question){
    this.db.setCollection('question');
    const result = await this.db.insertOne(question);
    return result;
  }

  async upsertQuestion(params, document){
    this.db.setCollection('question');
    const result = await this.db.upsertOne(params, document);
    return result;
  }

  async removeQuestion(params){
    this.db.setCollection('question');
    const result = await this.db.deleteOne(params);
    return result;
  }

  async insertAnswer(answer){
    this.db.setCollection('answer');
    const result = await this.db.insertOne(answer);
    return result;
  }

  async upsertAnswer(params, document){
    this.db.setCollection('answer');
    const result = await this.db.upsertOne(params, document);
    return result;
  }

  async removeAnswer(params){
    this.db.setCollection('answer');
    const result = await this.db.deleteOne(params);
    return result;
  }
}

module.exports = Command;
