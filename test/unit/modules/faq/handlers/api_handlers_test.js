const sinon = require('sinon');
const { expect } = require('chai');
const faqHandler = require('../../../../../bin/modules/faq/handlers/api_handlers');
const queryHandler = require('../../../../../bin/modules/faq/repositories/queries/query_handler');
const commandHandler = require('../../../../../bin/modules/faq/repositories/commands/command_handler');
const validator = require('../../../../../bin/helpers/utils/validator');

describe('FAQ Api Handler', () => {
  let res;
  beforeEach(() => {
    res = {
      send: function () {
        return true;
      }
    };
  });

  const req = {
    body: {},
    params: {},
    query: {},
    user: {
      userId: '88b33dcd-1680-433e-a9fe-8b9bd209b384"',
      fullName: 'Super Administrator'
    },
    authorization: {
      credentials: 'xx'
    },
    headers: [
      'accept-language', 'en'
    ]
  };

  const reqs = {
    body: {},
    params: {},
    query: {},
    user: {
      userId: '88b33dcd-1680-433e-a9fe-8b9bd209b384"',
      fullName: 'Super Administrator'
    },
    files: {
      iconMobile: {
        name: 'image'
      },
      iconWebsite: {
        name: 'image'
      },
      backgroundMobile: {
        name: 'image'
      },
      backgroundWebsite: {
        name: 'image'
      }
    },
    authorization: {
      credentials: 'xx'
    }
  };

  const resultSucces = {
    err: null,
    message: 'success',
    data: [],
    code: 200
  };

  const resultError = {
    err: true
  };

  describe('Get All FAQ', () => {
    it('should cover error validation', async () => {
      await faqHandler.getFaq(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getFaq').resolves(resultError);
      expect(await faqHandler.getFaq(req, res));
      queryHandler.getFaq.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getFaq').resolves(resultSucces);
      expect(await faqHandler.getFaq(req, res));
      queryHandler.getFaq.restore();
    });
  });

  describe('Get List FAQ', () => {
    it('should cover error validation', async () => {
      await faqHandler.listTopicFaq(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'listTopicFaq').resolves(resultError);
      expect(await faqHandler.listTopicFaq(req, res));
      queryHandler.listTopicFaq.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'listTopicFaq').resolves(resultSucces);
      expect(await faqHandler.listTopicFaq(req, res));
      queryHandler.listTopicFaq.restore();
    });
  });

  describe('Get Topic Detail', () => {
    it('should cover error validation', async () => {
      await faqHandler.getTopicDetail(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getTopicDetail').resolves(resultError);
      expect(await faqHandler.getTopicDetail(req, res));
      queryHandler.getTopicDetail.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getTopicDetail').resolves(resultSucces);
      expect(await faqHandler.getTopicDetail(req, res));
      queryHandler.getTopicDetail.restore();
    });
  });

  describe('update Topic List', () => {
    it('should cover error validation', async () => {
      await faqHandler.updateTopicList(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateTopicList').resolves(resultError);
      expect(await faqHandler.updateTopicList(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateTopicList.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateTopicList').resolves(resultSucces);
      expect(await faqHandler.updateTopicList(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateTopicList.restore();
    });
  });

  describe('Get Question', () => {
    it('should cover error validation', async () => {
      await faqHandler.getQuestion(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getQuestion').resolves(resultError);
      expect(await faqHandler.getQuestion(req, res));
      queryHandler.getQuestion.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getQuestion').resolves(resultSucces);
      expect(await faqHandler.getQuestion(req, res));
      queryHandler.getQuestion.restore();
    });
  });

  describe('Get Topic Detail', () => {
    it('should cover error validation', async () => {
      await faqHandler.getQuestionDetail(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getQuestionDetail').resolves(resultError);
      expect(await faqHandler.getQuestionDetail(req, res));
      queryHandler.getQuestionDetail.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getQuestionDetail').resolves(resultSucces);
      expect(await faqHandler.getQuestionDetail(req, res));
      queryHandler.getQuestionDetail.restore();
    });
  });

  describe('Get All FAQ Question By Category', () => {
    it('should cover error validation', async () => {
      await faqHandler.getFaqQuestion(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getFaqQuestion').resolves(resultError);
      expect(await faqHandler.getFaqQuestion(req, res));
      queryHandler.getFaqQuestion.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getFaqQuestion').resolves(resultSucces);
      expect(await faqHandler.getFaqQuestion(req, res));
      queryHandler.getFaqQuestion.restore();
    });
  });

  describe('Get FAQ Question Detail', () => {
    it('should cover error validation', async () => {
      await faqHandler.getFaqQuestionDetail(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getFaqQuestionDetail').resolves(resultError);
      expect(await faqHandler.getFaqQuestionDetail(req, res));
      queryHandler.getFaqQuestionDetail.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getFaqQuestionDetail').resolves(resultSucces);
      expect(await faqHandler.getFaqQuestionDetail(req, res));
      queryHandler.getFaqQuestionDetail.restore();
    });
  });

  describe('Get All FAQ Sub Category', () => {
    it('should cover error validation', async () => {
      await faqHandler.getFaqSubCategory(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getFaqSubCategory').resolves(resultError);
      expect(await faqHandler.getFaqSubCategory(req, res));
      queryHandler.getFaqSubCategory.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getFaqSubCategory').resolves(resultSucces);
      expect(await faqHandler.getFaqSubCategory(req, res));
      queryHandler.getFaqSubCategory.restore();
    });
  });

  describe('getTroubleshooting ', () => {
    it('should cover error validation', async () => {
      await faqHandler.getTroubleshooting(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'getTroubleshooting').resolves(resultError);
      expect(await faqHandler.getTroubleshooting(req, res));
      validator.isValidPayload.restore();
      queryHandler.getTroubleshooting.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'getTroubleshooting').resolves(resultSucces);
      expect(await faqHandler.getTroubleshooting(req, res));
      validator.isValidPayload.restore();
      queryHandler.getTroubleshooting.restore();
    });
  });

  describe('Post Topic FAQ', () => {
    it('should cover error validation', async () => {
      await faqHandler.postTopic(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'postTopic').resolves(resultError);
      expect(await faqHandler.postTopic(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.postTopic.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'postTopic').resolves(resultSucces);
      expect(await faqHandler.postTopic(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.postTopic.restore();
    });
  });

  describe('Update Topic FAQ', () => {
    it('should cover error validation', async () => {
      await faqHandler.updateTopic(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateTopic').resolves(resultError);
      expect(await faqHandler.updateTopic(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateTopic.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateTopic').resolves(resultSucces);
      expect(await faqHandler.updateTopic(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateTopic.restore();
    });
  });

  describe('Remove Topic FAQ', () => {
    it('should cover error validation', async () => {
      await faqHandler.removeTopic(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeTopic').resolves(resultError);
      expect(await faqHandler.removeTopic(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeTopic.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeTopic').resolves(resultSucces);
      expect(await faqHandler.removeTopic(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeTopic.restore();
    });
  });

  describe('Post FAQ question', () => {
    it('should cover error validation', async () => {
      await faqHandler.postQuestion(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'postQuestion').resolves(resultError);
      expect(await faqHandler.postQuestion(req, res));
      validator.isValidPayload.restore();
      commandHandler.postQuestion.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'postQuestion').resolves(resultSucces);
      expect(await faqHandler.postQuestion(req, res));
      validator.isValidPayload.restore();
      commandHandler.postQuestion.restore();
    });
  });

  describe('Update FAQ question', () => {
    it('should cover error validation', async () => {
      await faqHandler.updateQuestion(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateQuestion').resolves(resultError);
      expect(await faqHandler.updateQuestion(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateQuestion.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateQuestion').resolves(resultSucces);
      expect(await faqHandler.updateQuestion(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateQuestion.restore();
    });
  });

  describe('Remove FAQ question', () => {
    it('should cover error validation', async () => {
      await faqHandler.removeQuestion(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeQuestion').resolves(resultError);
      expect(await faqHandler.removeQuestion(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeQuestion.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeQuestion').resolves(resultSucces);
      expect(await faqHandler.removeQuestion(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeQuestion.restore();
    });
  });

  describe('Get Answers', () => {
    it('should cover error validation', async () => {
      await faqHandler.getAnswers(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getAnswers').resolves(resultError);
      expect(await faqHandler.getAnswers(req, res));
      queryHandler.getAnswers.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getAnswers').resolves(resultSucces);
      expect(await faqHandler.getAnswers(req, res));
      queryHandler.getAnswers.restore();
    });
  });

  describe('Search Answer', () => {
    it('should cover error validation', async () => {
      await faqHandler.searchAnswer(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'searchAnswer').resolves(resultError);
      expect(await faqHandler.searchAnswer(reqs, res));
      validator.isValidPayload.restore();
      queryHandler.searchAnswer.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'searchAnswer').resolves(resultSucces);
      expect(await faqHandler.searchAnswer(reqs, res));
      validator.isValidPayload.restore();
      queryHandler.searchAnswer.restore();
    });
  });

  describe('Get Answer Detail', () => {
    it('should cover error validation', async () => {
      await faqHandler.getAnswerDetail(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getAnswerDetail').resolves(resultError);
      expect(await faqHandler.getAnswerDetail(req, res));
      queryHandler.getAnswerDetail.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getAnswerDetail').resolves(resultSucces);
      expect(await faqHandler.getAnswerDetail(req, res));
      queryHandler.getAnswerDetail.restore();
    });
  });

  describe('Post FAQ answer', () => {
    it('should cover error validation', async () => {
      await faqHandler.postAnswer(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'postAnswer').resolves(resultError);
      expect(await faqHandler.postAnswer(req, res));
      validator.isValidPayload.restore();
      commandHandler.postAnswer.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'postAnswer').resolves(resultSucces);
      expect(await faqHandler.postAnswer(req, res));
      validator.isValidPayload.restore();
      commandHandler.postAnswer.restore();
    });
  });

  describe('Update FAQ answer', () => {
    it('should cover error validation', async () => {
      await faqHandler.updateAnswer(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateAnswer').resolves(resultError);
      expect(await faqHandler.updateAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateAnswer.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateAnswer').resolves(resultSucces);
      expect(await faqHandler.updateAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updateAnswer.restore();
    });
  });

  describe('Remove FAQ answer', () => {
    it('should cover error validation', async () => {
      await faqHandler.removeAnswer(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeAnswer').resolves(resultError);
      expect(await faqHandler.removeAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeAnswer.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeAnswer').resolves(resultSucces);
      expect(await faqHandler.removeAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeAnswer.restore();
    });
  });

  describe('Remove List answer', () => {
    it('should cover error validation', async () => {
      await faqHandler.removeListAnswer(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeListAnswer').resolves(resultError);
      expect(await faqHandler.removeListAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeListAnswer.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'removeListAnswer').resolves(resultSucces);
      expect(await faqHandler.removeListAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.removeListAnswer.restore();
    });
  });

  describe('Updated List answer', () => {
    it('should cover error validation', async () => {
      await faqHandler.updatedListAnswer(reqs, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updatedListAnswer').resolves(resultError);
      expect(await faqHandler.updatedListAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updatedListAnswer.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updatedListAnswer').resolves(resultSucces);
      expect(await faqHandler.updatedListAnswer(reqs, res));
      validator.isValidPayload.restore();
      commandHandler.updatedListAnswer.restore();
    });
  });
});
