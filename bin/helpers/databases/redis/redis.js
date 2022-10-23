const wrapper = require('../../utils/wrapper');
const pool = require('./connection');
const validate = require('validate.js');
const logger = require('../../utils/logger');

class Redis {

  constructor(config) {
    this.config = config.connection;
    this.index = config.index;
  }

  async selectDb(index) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed to select db on Redis');
      return wrapper.error(err);
    });

    clientRedis.select(index, async (err) => {
      if (err) {
        logger.log('redis-db', `change db to ${index}, : ${err}`, 'redis change db');
        return wrapper.error(err);
      }
    });
  }

  async setData(key, value) {

    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const convertToString = JSON.stringify({
      data: value
    });
    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed to set data on Redis');
      return wrapper.error(err);
    });
    clientRedis.select(this.index, async (err) => {
      if (err) {
        logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis set data');
        return wrapper.error(err);
      }
      clientRedis.set(key, convertToString);
    });
  }

  async setDataEx(key, value, duration) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const convertToString = JSON.stringify({
      data: value
    });
    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed to set dataEx on Redis');
      return wrapper.error(err);
    });

    clientRedis.select(this.index, async (err) => {
      if (err) {
        logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis set data');
        return wrapper.error(err);
      }
      clientRedis.set(key, convertToString, 'EX', duration);
    });
  }

  async getData(key) {
    let client = await pool.getConnection(this.config);

    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed Get data From Redis');
      return wrapper.error(err);
    });
    return new Promise(((resolve, reject) => {
      clientRedis.select(this.index, async (err) => {
        if (err) {
          logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis get data');
          return wrapper.error(err);
        }
        clientRedis.get(key, (err, replies) => {
          if (err) {
            reject(wrapper.error(err));
          }
          // didn't use wrapper.data because by default redis already make wrapper data
          // { "data": "value" }
          resolve(replies);
        });
      });

    }));
  }

  async getAllKeys(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed Get Keys From Redis');
      return wrapper.error(err);
    });
    return new Promise(((resolve, reject) => {
      clientRedis.select(this.index, async (err) => {
        if (err) {
          logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis get key');
          return wrapper.error(err);
        }
        clientRedis.keys(key, (err, replies) => {
          if (err) {
            reject(wrapper.error(err));
          }
          resolve(replies);
        });
      });
    }));
  }

  async deleteKey(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed Delete Key From Redis');
      return wrapper.error(err);
    });
    return new Promise(((resolve, reject) => {
      clientRedis.select(this.index, async (err) => {
        if (err) {
          logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis delete key');
          return wrapper.error(err);
        }
        clientRedis.del(key, (err, replies) => {
          if (err) {
            reject(wrapper.error(err));
          }
          resolve(replies);
        });
      });
    }));
  }

  async setZeroAttemp(key, duration) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed Set Zero Attempt From Redis');
      return wrapper.error(err);
    });
    return new Promise(((resolve, reject) => {
      clientRedis.set(key, 0, 'EX', duration, (err, replies) => {
        if (err) {
          reject(wrapper.error(err));
        }
        resolve(replies);
      });
    }));
  }

  async incrAttempt(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed increment attempt From Redis');
      return wrapper.error(err);
    });
    return new Promise(((resolve, reject) => {
      clientRedis.incr(key, (err, replies) => {
        if (err) {
          reject(wrapper.error(err));
        }
        resolve(replies);
      });
    }));
  }

  async setReminder(key, value, expire, action) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.log('redis-db', err, 'Failed Set Reminder From Redis');
      return wrapper.error(err);
    });
    return new Promise(((resolve, reject) => {
      clientRedis
        .multi()
        .set(`${action}-${key}`, value)
        .expire(`${action}-${key}`, expire)
        .exec((error, reply) => {
          if (error) {
            reject(wrapper.error(error));
          } else {
            resolve(reply);
          }
        });
    }));
  }


}


module.exports = Redis;
