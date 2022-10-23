const Minio = require('minio');
const config = require('../../../infra/configs/global_config');
const wrapper = require('../../utils/wrapper');
const logger = require('../../utils/logger');
let minioClient;

const init = () => {
  minioClient = new Minio.Client(config.get('/minio'));
  logger.log('minio-init', 'minio initialized', 'info');
};
const isBucketExist = (bucketName) => {
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(bucketName, (err, exists) => {
      if (err) {
        logger.log('minioSdk-isBucketExist', err.message, 'error check bucket');
        reject(err);
      }
      resolve(exists ? true : false);
    });
  });
};
const bucketCreate = async (bucketName, region = 'us-east-1') => {
  try {
    const isExists = await isBucketExist(bucketName);
    if (isExists) {
      return wrapper.data(true);
    }
    await minioClient.makeBucket(bucketName, region);
    return wrapper.data(true);
  } catch (err) {
    logger.log('minioSdk-bucketCreate', err.message, 'error create bucket');
    return wrapper.error(err);
  }
};
const bucketRemove = async (bucketName) => {
  try {
    await minioClient.removeBucket(bucketName);
    return wrapper.data(true);
  } catch (err) {
    logger.log('minioSdk-bucketRemove', err.message, 'error remove bucket');
    return wrapper.error(err);
  }
};
const objectUpload = async (bucketName, objectName, filePath) => {
  try {
    const isUploaded = await minioClient.fPutObject(bucketName, objectName, filePath);
    if (isUploaded) {
      return wrapper.data(isUploaded);
    }
  } catch (err) {
    logger.log('minioSdk-objectUpload', err.message, 'error upload object');
    return wrapper.error(err);
  }
};
const objectDownload = async (bucketName, objectName, filePath) => {
  try {
    const isDownloaded = await minioClient.fGetObject(bucketName, objectName, filePath);
    if (isDownloaded) {
      return wrapper.data(isDownloaded);
    }
  } catch (err) {
    logger.log('minioSdk-objectDownload', err.message, 'error download object');
    return wrapper.error(err);
  }
};
const objectRemove = async (bucketName, objectName) => {
  try {
    await minioClient.removeObject(bucketName, objectName);
    return wrapper.data(true);
  } catch (err) {
    logger.log('minioSdk-objectRemove', err.message, 'error remove object');
    return wrapper.error(err);
  }
};
const objectGetUrl = async (bucketName, objectName, expiry = 604800) => {
  try {
    const getUrl = await minioClient.presignedGetObject(bucketName, objectName, expiry);
    return wrapper.data(getUrl);
  } catch (err) {
    logger.log('minioSdk-objectUrl', err.message, 'error get object url');
    return wrapper.error(err);
  }
};

module.exports = {
  init,
  bucketCreate,
  bucketRemove,
  objectUpload,
  objectGetUrl,
  objectDownload,
  objectRemove
};
