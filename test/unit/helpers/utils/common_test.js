const assert = require('assert');
const { expect } = require('chai');
const rp = require('request-promise');
const Redis = require('../../../../bin/helpers/databases/redis/redis');
const sinon = require('sinon');
const commonUtil = require('../../../../bin/helpers/utils/common');
const { InternalServerError } = require('../../../../bin/helpers/error');
const config = require('../../../../bin/infra/configs/global_config');

describe('Common', () => {
  describe('getLastFromURL', () => {
    it('should return succes', async() => {
      const res = await commonUtil.getLastFromURL('http://localhost:9000/dev');
      assert(res, 'dev');
    });
  });

  describe('getJwtLegacy', () => {
    it('should return redisClient.getData', async() => {
      sinon.stub(Redis.prototype, 'getData').resolves({data:'{ "data": { "jwt": "token" } }'});
      const res = await commonUtil.getJwtLegacy();
      expect(res).to.have.keys(['err', 'data']);
      expect(res.err).to.be.null;
      expect(res.data).to.eql('token');
      Redis.prototype.getData.restore();
    });

    it('should return getJwt', async() => {
      sinon.stub(Redis.prototype, 'getData').resolves(null);
      sinon.stub(commonUtil, 'getJwt').resolves({ err: false, jwt: 'token' });
      sinon.stub(config, 'get').returns('url');
      sinon.stub(rp, 'Request').resolves({ jwt: 'token' });
      sinon.stub(Redis.prototype, 'setDataEx').resolves(null);
      const res = await commonUtil.getJwtLegacy();
      expect(res).to.have.keys(['err', 'data']);
      expect(res.err).to.be.null;
      Redis.prototype.getData.restore();
      Redis.prototype.setDataEx.restore();
      commonUtil.getJwt.restore();
      config.get.restore();
      rp.Request.restore();
    });
  });

  describe('getJwt', () => {
    it('should return success', async() => {
      sinon.stub(rp, 'Request').resolves({ jwt: 'token' });
      sinon.stub(config, 'get').returns('url');
      const res = await commonUtil.getJwt();
      expect(res).to.have.keys(['jwt']);
      expect(res.jwt).to.eql('token');
      rp.Request.restore();
      config.get.restore();
    });

    it('should return error', async() => {
      const err = new Error('error');
      sinon.stub(rp, 'Request').throws(err);
      sinon.stub(config, 'get').returns('url');
      const res = await commonUtil.getJwt();
      expect(res).to.have.keys(['err', 'data']);
      expect(res.err).to.eql(new InternalServerError('Internal server error'));
      rp.Request.restore();
      config.get.restore();
    });
  });
});

