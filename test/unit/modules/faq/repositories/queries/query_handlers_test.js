const assert = require('assert');
const sinon = require('sinon');
const queryHandler = require('../../../../../../bin/modules/faq/repositories/queries/query_handler');
const Faq = require('../../../../../../bin/modules/faq/repositories/queries/domain');

describe('FAQ-queryHandler', () => {

  const data = {
    success: true,
    data: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
    message: 'Your Request Has Been Processed',
    code: 200
  };

  const payload = {
    'username': 'alifsn',
    'password': 'telkomdev'
  };

  describe('getFaq', () => {
    it('should return success FAQ', async() => {
      sinon.stub(Faq.prototype, 'getFaq').resolves(data);

      const rs = await queryHandler.getFaq(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);

      Faq.prototype.getFaq.restore();
    });
  });

  describe('getFaqQuestion', () => {
    it('should return success getFaqQuestion ', async() => {
      sinon.stub(Faq.prototype, 'getFaqQuestion').resolves(data);

      const rs = await queryHandler.getFaqQuestion(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);

      Faq.prototype.getFaqQuestion.restore();
    });
  });

  describe('getFaqQuestionDetail', () => {
    it('should return success getFaqQuestionDetail', async() => {
      sinon.stub(Faq.prototype, 'getFaqQuestionDetail').resolves(data);

      const rs = await queryHandler.getFaqQuestionDetail(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);

      Faq.prototype.getFaqQuestionDetail.restore();
    });
  });

  describe('getFaqSubCategory', () => {
    it('should return success getFaqSubCategory', async() => {
      sinon.stub(Faq.prototype, 'getFaqSubCategory').resolves(data);

      const rs = await queryHandler.getFaqSubCategory(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);

      Faq.prototype.getFaqSubCategory.restore();
    });
  });

  describe('getTroubleshooting', () => {
    it('should return success getTroubleshooting', async() => {
      sinon.stub(Faq.prototype, 'getTroubleshooting').resolves(data);

      const rs = await queryHandler.getTroubleshooting(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);

      Faq.prototype.getTroubleshooting.restore();
    });
  });

  describe('searchFaq', () => {
    it('should return success searchFaq', async() => {
      sinon.stub(Faq.prototype, 'searchFaq').resolves(data);
      const rs = await queryHandler.searchFaq(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Faq.prototype.searchFaq.restore();
    });
  });
});
