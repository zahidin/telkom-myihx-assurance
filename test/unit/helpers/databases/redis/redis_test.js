const sinon = require('sinon');
const { expect } = require('chai');
const Redis = require('../../../../../bin/helpers/databases/redis/redis');
const redisConnection = require('../../../../../bin/helpers/databases/redis/connection');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('Redis', () => {
  const mock = sinon.createSandbox();
  let redisClient;
  beforeEach(async () => {
    mock.stub(redisConnection, 'getConnection').resolves([]);
    redisClient = mock.stub(redisConnection, 'createConnectionPool');
    redisClient.resolves([
      {
        config: { host: 'localhost', port: '6379', password: '' },
        client: {
          on : sinon.stub().yields('fail', null, null),
          select : sinon.stub().yields('fail', null, null),
          set : sinon.stub().yields('fail', null, null),
          incr : sinon.stub().yields('fail', null, null)
        }
      }
    ]);
    sinon.stub(logger, 'log');
  });
  afterEach(() => {
    logger.log.restore();
    redisClient.restore();
    mock.restore();
  });

  describe('selectDb', () => {
    it('wrapper success', async () => {
      redisClient.returns([{
        client: {
          on : sinon.stub().yields('fail', null, null),
          select : sinon.stub().yields('fail', null, null),
          set : sinon.stub().yields('fail', null, null),
          incr : sinon.stub().yields('fail', null, null)
        }
      }]);
      expect(await Redis.prototype.selectDb(0));
    });
  });

  describe('setData', () => {
    it('wrapper error', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields('fail', null, null),
          select: sinon.stub().yields('fail', null, null),
          set: sinon.stub().yields(null, 'success')
        }
      }]);
      expect(await Redis.prototype.setData({}));
    });

    it('wrapper success', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields('fail', null, null),
          select: sinon.stub().yields(null, 'success'),
          set: sinon.stub().yields(null, 'success')
        }
      }]);
      expect(await Redis.prototype.setData({}));
    });
  });

  describe('setDataEx', () => {
    it('wrapper error', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields('fail', null, null),
          select: sinon.stub().yields('fail', null, null),
        }
      }]);
      expect(await Redis.prototype.setDataEx({}));
    });

    it('wrapper success', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields(null, 'success'),
          select: sinon.stub().yields(null, 'success'),
          set: sinon.stub().yields(null, 'success'),
        }
      }]);
      expect(await Redis.prototype.setDataEx({}));
    });
  });

  describe('getData', () => {
    it('wrapper succes', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields(null, 'success'),
          select: sinon.stub().yields(null, 'success'),
          get: sinon.stub().yields(null, 'success'),
        }
      }]);
      expect(await Redis.prototype.getData({}));
    });
  });

  describe('getAllKeys', () => {
    it('wrapper success', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields(null, 'success'),
          select: sinon.stub().yields(null, 'success'),
          keys: sinon.stub().yields(null, 'success'),
        }
      }]);
      expect(await Redis.prototype.getAllKeys({}));
    });
  });

  describe('deleteKey', () => {
    it('wrapper succes', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields(null, 'success'),
          select: sinon.stub().yields(null, 'success'),
          del: sinon.stub().yields(null, 'success'),
        }
      }]);
      expect(await Redis.prototype.deleteKey({}));
    });
  });

  describe('setZeroAttemp', () => {
    it('wrapper success', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields(null, 'success'),
          set: sinon.stub().yields(null, 'success')
        }
      }]);
      expect(await Redis.prototype.setZeroAttemp({}));
    });
  });

  describe('incrAttempt', () => {
    it('wrapper succes', async () => {
      redisClient.returns([{
        client: {
          on: sinon.stub().yields(null, 'success'),
          incr: sinon.stub().yields(null, 'success')
        }
      }]);
      expect(await Redis.prototype.incrAttempt({}));
    });
  });

  describe('setReminder', () => {
    it('wrapper success',  () => {
      redisClient.returns([{
        client: {
          on : sinon.stub().yields('fail', null, null),
          set : sinon.stub().yields('fail', null, null),
          expire : sinon.stub().yields('fail', null, null),
          exec : sinon.stub().yields(null, 'success')
        }
      }]);
      expect(Redis.prototype.setReminder('','',0,''));
    });
  });

});
