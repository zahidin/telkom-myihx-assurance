const rp = require('request-promise');
const sinon = require('sinon');
const assert = require('assert');
const service = require('../../../../../bin/modules/faq/utils/service');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('FAQ Utils Service', () => {
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

  describe('checkGamas', () => {
    it('should return Check Gamas Error', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.checkGamas(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Check Gamas Error');
    });
    it('should return success checkGamas', async () => {
      const assetNum = '50076586_123456679924_INTERNET';
      const payload = {
        jwt: 'token',
        body:{
          EXTTransactionID: '11082020',
          SID: [assetNum]
        }
      };
      sinon.stub(rp, 'post').resolves({
        EXTTransactionID: '11082020',
        SID: [assetNum]
      });
      const result = await service.checkGamas(payload);
      rp.post.restore();
      assert.equal(result.EXTTransactionID, '11082020');
    });
  });

  describe('checkIsolir', () => {
    it('should return Check Isolir Error', async () => {
      const payload = {
        jwt: 'token',
        body:[Object],
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.checkIsolir(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Check Isolir Error');
    });
    it('should return success checkIsolir', async () => {
      const payload = {
        jwt: 'token',
        body: {
          checkND: {
            I_MSISDN: '123456679924',
          }
        }
      };
      sinon.stub(rp, 'post').resolves({
        checkND: {
          I_MSISDN: '123456679924',
        }
      });
      const result = await service.checkIsolir(payload);
      rp.post.restore();
      assert.equal(result.checkND.I_MSISDN, '123456679924');
    });
  });

  describe('checkInquiry', () => {
    it('should return Check Inquiry Error', async () => {
      const payload = {
        jwt: 'token',
        body:[Object],
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.checkInquiry(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Check Inquiry Error');
    });
    it('should return success checkInquiry', async () => {
      const payload = {
        jwt: 'token',
        body: {
          indihome_number: '123456679924',
        }
      };
      sinon.stub(rp, 'post').resolves({
        indihome_number: '123456679924'
      });
      const result = await service.checkInquiry(payload);
      rp.post.restore();
      assert.equal(result.indihome_number, '123456679924');
    });
  });

  describe('getPelanggan', () => {
    it('should return Check Inquiry Error', async () => {
      const payload = {
        jwt: 'token',
        body:[Object],
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.getPelanggan(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success getPelanggan', async () => {
      const payload = {
        jwt: 'token',
        body: {
          indihomeNumber: '123456679924',
        }
      };
      sinon.stub(rp, 'post').resolves({
        indihomeNumber: '123456679924'
      });
      const result = await service.getPelanggan(payload);
      rp.post.restore();
      assert.equal(result.indihomeNumber, '123456679924');
    });
  });
});
