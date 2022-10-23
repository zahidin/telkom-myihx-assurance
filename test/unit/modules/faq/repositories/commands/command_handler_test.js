const commandHandler = require('../../../../../../bin/modules/faq/repositories/commands/command_handler');
const Faq = require('../../../../../../bin/modules/faq/repositories/commands/domain');
const sinon = require('sinon');
const assert = require('assert');

describe('FAQ-commandHandler', () => {
  const data = {
    success: true,
    data: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
    message: 'Your Request Has Been Processed',
    code: 200
  };

  describe('postTopic', () => {
    const payload = {
      'categoryId': 'Test asddasd',
      'categoryEn': 'Testing asddasd',
      'icon': 'internet.png'
    };

    it('should return post topic faq', async() => {
      sinon.stub(Faq.prototype, 'postTopic').resolves(data);
      const rs = await commandHandler.postTopic(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.postTopic.restore();
    });
  });

  describe('updateTopicList', () => {
    const payload = {
      'categoryId': 'Test asddasd',
      'categoryEn': 'Testing asddasd',
      'icon': 'internet.png'
    };

    it('should return updated topic list', async() => {
      sinon.stub(Faq.prototype, 'updateTopicList').resolves(data);
      const rs = await commandHandler.updateTopicList(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.updateTopicList.restore();
    });
  });

  describe('updatedListAnswer', () => {
    const payload = {
      'categoryId': 'Test asddasd',
      'categoryEn': 'Testing asddasd',
      'icon': 'internet.png'
    };

    it('should return updated answer list', async() => {
      sinon.stub(Faq.prototype, 'updatedListAnswer').resolves(data);
      const rs = await commandHandler.updatedListAnswer(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.updatedListAnswer.restore();
    });
  });

  describe('removeListAnswer', () => {
    const payload = {
      'answerId': '5f3f664b-8992-4c34-b629-0341769c3178'
    };

    it('should return remove answer list', async() => {
      sinon.stub(Faq.prototype, 'removeListAnswer').resolves(data);
      const rs = await commandHandler.removeListAnswer(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.removeListAnswer.restore();
    });
  });

  describe('updateTopic', () => {
    const payload = {
      'categoryId': 'Test asddasd',
      'categoryEn': 'Testing asddasd',
      'icon': 'internet.png'
    };

    it('should return updated topic faq', async() => {
      sinon.stub(Faq.prototype, 'updateTopic').resolves(data);
      const rs = await commandHandler.updateTopic(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.updateTopic.restore();
    });
  });

  describe('removeTopic', () => {
    const payload = {
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178'
    };

    it('should return remove topic faq', async() => {
      sinon.stub(Faq.prototype, 'removeTopic').resolves(data);
      const rs = await commandHandler.removeTopic(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.removeTopic.restore();
    });
  });

  describe('postQuestion', () => {
    const payload = {
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'subCategory': 'Information',
      'questionId': 'Coba',
      'titleLanEn': 'Testing',
      'answers': {}
    };

    it('should return post faq question', async() => {
      sinon.stub(Faq.prototype, 'postQuestion').resolves(data);
      const rs = await commandHandler.postQuestion(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.postQuestion.restore();
    });
  });

  describe('updateQuestion', () => {
    const payload = {
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'subCategory': 'Information',
      'questionId': 'Coba',
      'titleLanEn': 'Testing',
      'answers': {}
    };

    it('should return update faq question', async() => {
      sinon.stub(Faq.prototype, 'updateQuestion').resolves(data);
      const rs = await commandHandler.updateQuestion(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.updateQuestion.restore();
    });
  });

  describe('removeFaq', () => {
    const payload = {
      'questionId': '6f0dded5-60fd-44e8-ac1d-667acb679a51'
    };

    it('should return remove faq question', async() => {
      sinon.stub(Faq.prototype, 'removeQuestion').resolves(data);
      const rs = await commandHandler.removeQuestion(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.removeQuestion.restore();
    });
  });

  describe('postAnswer', () => {
    const payload = {
      'keywords': 'Information',
      'descriptionLangId': 'contoh',
      'descriptionLangEn': 'example',
    };

    it('should return post faq answer', async() => {
      sinon.stub(Faq.prototype, 'postAnswer').resolves(data);
      const rs = await commandHandler.postAnswer(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.postAnswer.restore();
    });
  });

  describe('updateAnswer', () => {
    const payload = {
      'keywords': 'Information',
      'descriptionLangId': 'contoh',
      'descriptionLangEn': 'example',
    };

    it('should return update faq answer', async() => {
      sinon.stub(Faq.prototype, 'updateAnswer').resolves(data);
      const rs = await commandHandler.updateAnswer(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.updateAnswer.restore();
    });
  });

  describe('removeAnswer', () => {
    const payload = {
      'answerId': '6f0dded5-60fd-44e8-ac1d-667acb679a51'
    };

    it('should return remove faq answer', async() => {
      sinon.stub(Faq.prototype, 'removeAnswer').resolves(data);
      const rs = await commandHandler.removeAnswer(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.removeAnswer.restore();
    });
  });
});
