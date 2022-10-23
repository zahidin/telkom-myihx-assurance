const assert = require('assert');
const sinon = require('sinon');
const Command = require('../../../../../../bin/modules/faq/repositories/commands/command');

describe('FAQ-command', () => {
  const topic = {
    'err': null,
    'data': {
      '_id': '5efedd00e67fb170dcf9336a',
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'categoryId': 'Internet',
      'categoryEn': 'Internet',
      'icon': 'internet.png',
      'createdAt': '2020-07-03T07:23:44.601Z',
      'lastModified': '2020-07-03T04:08:27.349Z',
    },
  };

  const question = {
    'err': null,
    'data': {
      '_id': '5efedd00e67fb170dcf9336a',
      'questionId':'6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
      'topicId':'5f3f664b-8992-4c34-b629-0341769c3178',
      'subCategory':'Troubleshooting',
      'titleLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
      'titleLangEn':'All the services (phone, Internet and TV) are not working',
      'answers':[
        {
          'answerId': 'c4e96887-e40e-4404-af5d-90218645959e',
          'number': 0
        }
      ],
      'createdAt': '2020-07-03T07:23:44.601Z',
      'lastModified': '2020-07-03T04:08:27.349Z',
    },
  };

  const answer = {
    'err': null,
    'data': {
      '_id': '5efedd00e67fb170dcf9336a',
      'answerId': 'c4e96887-e40e-4404-af5d-90218645959e',
      'keywords':'-',
      'descriptionLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
      'descriptionLangEn':'All the services (phone, Internet and TV) are not working',
      'createdAt': '2020-07-03T07:23:44.601Z',
      'lastModified': '2020-07-03T04:08:27.349Z',
    },
  };

  describe('Topic FAQ', () => {
    it('should success to insert data Topic FAQ to db', async() => {
      const db = {
        insertOne: sinon.stub().resolves(topic),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.insertTopicFaq({});
      assert.equal(res.data.categoryId, topic.data.categoryId);
    });
    it('should success to Upsert Topic FAQ to db', async() => {
      const db = {
        upsertOne: sinon.stub().resolves('5f3f664b-8992-4c34-b629-0341769c3178', topic),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.upsertTopic({});
      assert.equal(res, topic.data.topicId);
    });
    it('should success to Remove Topic FAQ to db', async() => {
      const db = {
        deleteOne: sinon.stub().resolves('5f3f664b-8992-4c34-b629-0341769c3178', topic),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.removeTopic({});
      assert.equal(res, topic.data.topicId);
    });
  });

  describe('FAQ Question', () => {
    it('should success to insert data FAQ question to db', async() => {
      const db = {
        insertOne: sinon.stub().resolves(question),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.insertQuestion({});
      assert.equal(res.data.titleLangEn, question.data.titleLangEn);
    });
    it('should success to Upsert FAQ question to db', async() => {
      const db = {
        upsertOne: sinon.stub().resolves('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', question),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.upsertQuestion({});
      assert.equal(res, question.data.questionId);
    });
    it('should success to Remove FAQ question to db', async() => {
      const db = {
        deleteOne: sinon.stub().resolves('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', question),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.removeQuestion({});
      assert.equal(res, question.data.questionId);
    });
  });

  describe('FAQ Answer', () => {
    it('should success to insert data FAQ Answer to db', async() => {
      const db = {
        insertOne: sinon.stub().resolves(answer),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.insertAnswer({});
      assert.equal(res.data.descriptionLangId, answer.data.descriptionLangId);
    });
    it('should success to Upsert FAQ answer to db', async() => {
      const db = {
        upsertOne: sinon.stub().resolves('c4e96887-e40e-4404-af5d-90218645959e', answer),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.upsertAnswer({});
      assert.equal(res, answer.data.answerId);
    });
    it('should success to Remove FAQ aswer to db', async() => {
      const db = {
        deleteOne: sinon.stub().resolves('c4e96887-e40e-4404-af5d-90218645959e', answer),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.removeAnswer({});
      assert.equal(res, answer.data.answerId);
    });
  });
});
