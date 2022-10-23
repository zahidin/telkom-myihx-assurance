const logger = require('../../../../../bin/helpers/utils/logger');
const sinon = require('sinon');
const redis = require('redis-mock');
const assert = require('assert');
const redisConnection = require('../../../../../bin/helpers/databases/redis/connection');

describe('Redis Connection', () => {
  const mock = sinon.createSandbox();
  const redisHost = {
    host: 'redis',
    port: '6379',
    password: ''
  };
  const connectionPool = [];

  beforeEach(() => {
    sinon.stub(logger, 'log');
  });
  afterEach(() => {
    logger.log.restore();
    mock.restore();
  });
  it('should createConnectionPool', async() => {
    const createConnection = redisConnection.createConnectionPool;
    const res = await createConnection(redisHost);
    assert.notEqual(res, null);
  });
  it('should createConnectionPool', async() => {
    const createConnection = redisConnection.createConnectionPool;
    mock.stub(connectionPool, 'findIndex').resolves('-1');
    mock.stub(redis, 'createClient').resolves({});
    const res = await createConnection(redisHost);
    assert.notEqual(res, null);
  });
  it('should getConnection', async() => {
    const res = await redisConnection.getConnection();
    assert.notEqual(res, []);
  });
});
