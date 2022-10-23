const rp = require('request-promise');
const sinon = require('sinon');
const assert = require('assert');
const service = require('../../../../../bin/modules/modem/utils/service');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('Modem Utils Service', () => {
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

  describe('checkIbooster', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
        realm: 'telkom.net'
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.checkIbooster(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success checkIbooster', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
        realm: 'telkom.net'
      };
      sinon.stub(rp, 'post').resolves({indihomeNumber: '1234567890'});
      const result = await service.checkIbooster(payload);
      rp.post.restore();
      assert.equal(result.data.indihomeNumber, '1234567890');
    });
  });

  describe('resetModem', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
        realm: 'telkom.net'
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.resetModem(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success resetModem', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
        realm: 'telkom.net'
      };
      sinon.stub(rp, 'post').resolves({indihomeNumber: '1234567890'});
      const result = await service.resetModem(payload);
      rp.post.restore();
      assert.equal(result.data.indihomeNumber, '1234567890');
    });
  });
});
