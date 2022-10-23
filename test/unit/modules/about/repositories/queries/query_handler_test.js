const queryHandler = require('../../../../../../bin/modules/about/repositories/queries/query_handler');
const About = require('../../../../../../bin/modules/about/repositories/queries/domain');
const sinon = require('sinon');
const assert = require('assert');


describe('About-queryHandler', () => {
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


  describe('getAbout ', () => {
    it('should info success getAbout', async() => {
      sinon.stub(About.prototype, 'getAbout').resolves(data);
      const rs = await queryHandler.getAbout(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      About.prototype.getAbout.restore();
    });
  });

  describe('about', () => {
    it('should info success about', async() => {
      sinon.stub(About.prototype, 'about').resolves(data);
      const rs = await queryHandler.about(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      About.prototype.about .restore();
    });
  });

  describe('getAboutId', () => {
    it('should info success getAboutId', async() => {
      sinon.stub(About.prototype, 'getAboutId').resolves(data);
      const rs = await queryHandler.getAboutId(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      About.prototype.getAboutId.restore();
    });
  });

});
