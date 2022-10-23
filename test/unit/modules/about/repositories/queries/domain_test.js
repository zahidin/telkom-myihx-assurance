const sinon = require('sinon');
const assert = require('assert');
const About = require('../../../../../../bin/modules/about/repositories/queries/domain');
const query = require('../../../../../../bin/modules/about/repositories/queries/query');
const logger = require('../../../../../../bin/helpers/utils/logger');


describe('Domain About', () => {
  beforeEach(async () => {
    sinon.stub(logger, 'log');
    sinon.stub(logger, 'info');
    sinon.stub(logger, 'error');
  });

  afterEach(async () => {
    logger.log.restore();
    logger.info.restore();
    logger.error.restore();
  });

  const db = {
    setCollection: sinon.stub()
  };

  const about = new About(db);

  const aboutOne = {
    'err': null,
    'data': {
      'aboutId' : '248cbfac-1b48-40c7-8e72-b08c814c8b8e',
      'description' : {
        'id' : 'bahasa indonesia',
        'en' : 'english language'
      },
      'icon' : {
        'website' : 'about/website/logo/16c7e1b3-ddc3-4cf4-b696-c8cca88809f0.jpg',
        'mobile' : 'about/mobile/logo/d2f24da3-9875-4e4c-907c-9913feb85e83.jpg'
      },
      'publish' : '2020-01-1',
      'status' : 'inactive',
      'creatorId' : '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'creatorName' : 'Super Administrator',
      'updatedId' : '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'updatedName' : 'Super Administrator',
      'createdAt' : '2021-02-01T09:56:09.403+07:00',
      'lastModified' : '2021-02-04T10:00:12.454+07:00',
      'socialMedia' : [
        {
          'website' : 'about/website/icon/6530d1c3-bedc-4cac-be18-536cfeafc851.jpg',
          'mobile' : 'about/mobile/icon/a212ea58-63dd-43c6-a069-1f784aec699c.jpg',
          'url' : 'https://facebook.com'
        },
        {
          'website' : 'about/website/icon/838fc616-bfc9-4493-8fd9-e5bd7437ad03.jpg',
          'mobile' : 'about/mobile/icon/a52ce7c4-ee51-454a-8f2d-c05eea409c2f.jpg',
          'url' : 'https://twitter.com'
        }
      ]
    }
  };

  describe('Get About', () => {
    it('should return error about no result', async() => {
      const payload = {
        row: 0,
        page: 0,
        description:'test',
        lastUpdated:'2021-01-01',
        status:'["active"]'
      };
      sinon.stub(query.prototype, 'findAllAbout').resolves({err: true});
      const result = await about.getAbout('id',payload);
      query.prototype.findAllAbout.restore();
      assert.equal(result.err.message, 'About no result');
    });

    it('should return success about', async() => {
      const payload = {
        row: 0,
        page: 0,
        description:'test',
        lastUpdated:'2021-01-01',
        status:'["active"]'
      };
      sinon.stub(query.prototype, 'findAllAbout').resolves({err: false, data:[aboutOne.data]});
      sinon.stub(query.prototype, 'countAbout').resolves({data:1});
      const result = await about.getAbout('id',payload);
      query.prototype.findAllAbout.restore();
      query.prototype.countAbout.restore();
      assert.equal(result.err, null);
    });

    it('should return success about with empty payload', async() => {
      sinon.stub(query.prototype, 'findAllAbout').resolves({err: false, data:[aboutOne.data]});
      sinon.stub(query.prototype, 'countAbout').resolves({data:1});
      const result = await about.getAbout('id', {});
      query.prototype.findAllAbout.restore();
      query.prototype.countAbout.restore();
      assert.equal(result.err, null);
    });

    it('should return success about with count data error', async() => {
      sinon.stub(query.prototype, 'findAllAbout').resolves({err: false, data:[aboutOne.data]});
      sinon.stub(query.prototype, 'countAbout').resolves({err:true});
      const result = await about.getAbout('id', {});
      query.prototype.findAllAbout.restore();
      query.prototype.countAbout.restore();
      assert.equal(result.err, null);
    });
  });

  describe('Get About by id', () => {
    it('should return error about no result', async() => {
      const payload = {
        id:'123123'
      };
      sinon.stub(query.prototype, 'findOneAbout').resolves({err: true});
      const result = await about.getAboutId(payload);
      query.prototype.findOneAbout.restore();
      assert.equal(result.err.message, 'About no result');
    });

    it('should return success about', async() => {
      const payload = {
        id:'123123'
      };
      sinon.stub(query.prototype, 'findOneAbout').resolves({err: false, data:aboutOne.data});
      const result = await about.getAboutId('id',payload);
      query.prototype.findOneAbout.restore();
      assert.equal(result.err, null);
    });
  });

  describe('Get About active', () => {
    it('should return error about no result', async() => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err: true});
      const result = await about.about('id');
      query.prototype.findOneAbout.restore();
      assert.equal(result.err.message, 'About no result');
    });

    it('should return success about', async() => {
      sinon.stub(query.prototype, 'findOneAbout').resolves({err: false, data:aboutOne.data});
      const result = await about.about('id');
      query.prototype.findOneAbout.restore();
      assert.equal(result.err, null);
    });
  });


});
