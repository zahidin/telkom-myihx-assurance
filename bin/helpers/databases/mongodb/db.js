
const validate = require('validate.js');
const mongoConnection = require('./connection');
const wrapper = require('../../utils/wrapper');
const logger = require('../../utils/logger');

class DB {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.replace('//', '');
    /* eslint no-useless-escape: "error" */
    const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
    const dbName = pattern.exec(config);
    return dbName[1];
  }

  async findOne(parameter) {
    const ctx = 'mongodb-findOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.findOne(parameter);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find One Mongo ${err.message}`);
    }

  }

  async findMany(parameter) {
    const ctx = 'mongodb-findMany';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.find(parameter).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found , Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find Many Mongo ${err.message}`);
    }
  }

  async findManySort(parameter) {
    const ctx = 'mongodb-findMany';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = {};
      parameterSort['position'] = 1;
      const recordset = await db.find(parameter).sort(parameterSort).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found, Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find Many Mongo ${err.message}`);
    }
  }

  async findManySortByScore(parameter) {
    const ctx = 'mongodb-findManySortByScore';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.find(parameter).project({ score: { $meta: 'textScore' } }).sort( { score: { $meta: 'textScore' } } ).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found , Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find Many Mongo ${err.message}`);
    }
  }

  async createIndex() {
    const ctx = 'mongodb-createIndex';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.createIndex({'$**':'text'}, {'weights': { descriptionId: 3,descriptionEn:3, technicalLanguage:1 }});
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find Many Mongo ${err.message}`);
    }
  }

  async insertOne(document) {
    const ctx = 'mongodb-insertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertOne(document);
      if (recordset.result.n !== 1) {
        return wrapper.error('Failed Inserting Data to Database');
      }
      return wrapper.data(document);

    } catch (err) {
      logger.log(ctx, err.message, 'Error insert data in mongodb');
      return wrapper.error(`Error Insert One Mongo ${err.message}`);
    }
  }

  async insertMany(data) {
    const ctx = 'mongodb-insertMany';
    const document = data;
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertMany(document);
      if (recordset.result.n < 1) {
        return wrapper.error('Failed Inserting Data to Database');
      }
      return wrapper.data(document);

    } catch (err) {
      logger.log(ctx, err.message, 'Error insert data in mongodb');
      return wrapper.error(`Error Insert Many Mongo ${err.message}`);
    }

  }

  // nModified : 0 => data created
  // nModified : 1 => data updated
  async upsertOne(parameter, updateQuery) {
    const ctx = 'mongodb-upsertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const data = await db.updateOne(parameter, updateQuery, { upsert: true });
      if (data.result.nModified >= 0) {
        const { result: { nModified } } = data;
        const recordset = await this.findOne(parameter);
        if (nModified === 0) {
          return wrapper.data(recordset.data);
        }
        return wrapper.data(recordset.data);

      }
      return wrapper.error('Failed upsert data');
    } catch (err) {
      logger.log(ctx, err.message, 'Error upsert data in mongodb');
      return wrapper.error(`Error Upsert Mongo ${err.message}`);
    }
  }

  async findAllData(fieldName, row, page, param) {
    const ctx = 'mongodb-findAllData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = {};
      parameterSort[fieldName] = 1;
      const parameterPage = row * (page - 1);
      const recordset = await db.find(param).sort(parameterSort).limit(row).skip(parameterPage)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found, Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error upsert data in mongodb');
      return wrapper.error(`Error Mongo ${err.message}`);
    }
  }

  /*
   * @param {* } fieldName {status: 1, position: 1}
   * @param {*} row
   * @param {*} page
   * @param {*} param {creatorName : 'Internet'}
   */
  async findAllDataMultiSort(fieldName, row, page, param) {
    const ctx = 'mongodb-findAllData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = fieldName;
      const parameterPage = row * (page - 1);
      const recordset = await db.find(param).sort(parameterSort).limit(row).skip(parameterPage)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found, Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error upsert data in mongodb');
      return wrapper.error(`Error Mongo ${err.message}`);
    }
  }

  async countData(param) {
    const ctx = 'mongodb-countData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.count(param);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found , Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error count data in mongodb');
      return wrapper.error(`Error Mongo ${err.message}`);
    }
  }

  async deleteOne(parameter) {
    const ctx = 'mongodb-deleteOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const data = await db.deleteOne(parameter);
      if (data.result.n >= 0) {
        return wrapper.data(`success delete ${parameter}`);
      }
      return wrapper.error(data.result);
    } catch (err) {
      logger.log(ctx, err.message, 'Error delete data in mongodb');
      return wrapper.error(`Error delete Mongo ${err.message}`);
    }
  }

  async aggregateData(param) {
    const ctx = 'mongodb-aggregate';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.aggregate(param).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found , Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find Many Mongo ${err.message}`);
    }
  }

  async findAggregateData(param, fieldName, row) {
    const ctx = 'mongodb-aggregate';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = {};
      parameterSort[fieldName] = -1;
      const recordset = await db.aggregate(param).sort(parameterSort).limit(row).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found , Please Try Another Input');
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find Many Mongo ${err.message}`);
    }
  }
}

module.exports = DB;
