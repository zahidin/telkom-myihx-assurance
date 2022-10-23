const sinon = require('sinon');
const assert = require('assert');
const minio = require('../../../../../../bin/helpers/components/minio/sdk');
const Faq = require('../../../../../../bin/modules/faq/repositories/commands/domain');
const query = require('../../../../../../bin/modules/faq/repositories/queries/query');
const command = require('../../../../../../bin/modules/faq/repositories/commands/command');
const fs = require('fs');
const logger = require('../../../../../../bin/helpers/utils/logger');

describe('FAQ-Domain', () => {
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

  const faqDB = new Faq(db);

  let payloadTopic = {
    'categoryId': 'Internet',
    'categoryEn': 'Internet',
    'iconMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'iconWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'file': 'Internet.png',
    'status': 'active'
  };
  let payloadTopicEmpty = {
    'categoryId': 'Internet',
    'categoryEn': 'Internet',
    'iconMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'iconWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'file': 'Internet.png',
  };
  let payloadTopicError = {
    'categoryId': 'Internet',
    'categoryEn': 'Internet',
    'iconMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'iconWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
  };
  let payloadTopicBackgroundError = {
    'categoryId': 'Internet',
    'categoryEn': 'Internet',
    'iconMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'iconWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.png',
      'type': 'image/png',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundMobile': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
    'backgroundWebsite': {
      'size': 49805,
      'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
      'name': 'Internet.gif',
      'type': 'image/gif',
      'mtime': '2020-04-24T07:41:07.309Z'
    },
  };
  let topicResult = {
    'err': null,
    'data': {
      '_id': '5bac53b45ea76b1e9bd58e1c',
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'categoryId': 'Internet',
      'categoryEn': 'Internet',
      'description': {
        'id': 'Description Indonesia Miral',
        'en': 'Description English Miral'
      },
      'imageMobile': {
        'icon': 'topic-icon-faq/default_picture.png',
        'background': 'topic-background-faq/default_picture.png'
      },
      'imageWebsite': {
        'icon': 'topic-icon-faq/default_picture.png',
        'background': 'topic-background-faq/default_picture.png'
      },
      'status': 'active',
      'publishDate': '2020-12-10',
      'position': 0,
      'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'creatorName': 'Super Administrator',
      'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'updatedName': 'Super Administrator',
      'createdAt': '2020-03-09T02:51:15.229Z',
      'lastModified': '2020-07-27T07:00:57.102Z'
    }
  };
  let topicResultInactive = {
    'err': null,
    'data': {
      '_id': '5bac53b45ea76b1e9bd58e1c',
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'categoryId': 'Internet',
      'categoryEn': 'Internet',
      'description': {
        'id': 'Description Indonesia Miral',
        'en': 'Description English Miral'
      },
      'imageMobile': {
        'icon': 'topic-icon-faq/default_picture.png',
        'background': 'topic-background-faq/default_picture.png'
      },
      'imageWebsite': {
        'icon': 'topic-icon-faq/default_picture.png',
        'background': 'topic-background-faq/default_picture.png'
      },
      'status': 'inactive',
      'publishDate': '2020-12-10',
      'position': 0,
      'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'creatorName': 'Super Administrator',
      'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
      'updatedName': 'Super Administrator',
      'createdAt': '2020-03-09T02:51:15.229Z',
      'lastModified': '2020-07-27T07:00:57.102Z'
    }
  };
  let payloadQuestion = {
    'topicId':'5f3f664b-8992-4c34-b629-0341769c3178',
    'subCategory':'Troubleshooting',
    'titleLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
    'titleLangEn':'All the services (phone, Internet and TV) are not working',
    'answers':[
      {
        'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
        'number': 0
      }
    ],
    'status': 'active',
    'createdAt': '2020-03-09T02:51:15.229Z',
    'lastModified': '2020-07-27T07:00:57.102Z'
  };
  let payloadPublisDateQuestion = {
    'topicId':'5f3f664b-8992-4c34-b629-0341769c3178',
    'subCategory':'Troubleshooting',
    'titleLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
    'titleLangEn':'All the services (phone, Internet and TV) are not working',
    'answers':[
      {
        'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
        'number': 0
      }
    ],
    'status': 'active',
    'publishDate': '2021-02-01',
    'createdAt': '2020-03-09T02:51:15.229Z',
    'lastModified': '2020-07-27T07:00:57.102Z'
  };
  let payloadPublisDateAndStatusInactiveQuestion = {
    'topicId':'5f3f664b-8992-4c34-b629-0341769c3178',
    'subCategory':'Troubleshooting',
    'titleLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
    'titleLangEn':'All the services (phone, Internet and TV) are not working',
    'answers':[
      {
        'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
        'number': 0
      }
    ],
    'status': 'inactive',
    'publishDate': '2021-02-01',
    'createdAt': '2020-03-09T02:51:15.229Z',
    'lastModified': '2020-07-27T07:00:57.102Z'
  };
  let resultQuestion = {
    'err': null,
    'data': {
      'topicId':'5f3f664b-8992-4c34-b629-0341769c3178',
      'subCategory':'Troubleshooting',
      'titleLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
      'titleLangEn':'All the services (phone, Internet and TV) are not working',
      'answers':[
        {
          'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
          'number': 0
        }
      ],
      'createdAt': '2020-03-09T02:51:15.229Z',
      'lastModified': '2020-07-27T07:00:57.102Z'
    }
  };
  let answerResult = {
    'err': null,
    'data': {
      '_id': '5efedd00e67fb170dcf9336a',
      'answerId': '6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
      'keyword':'-',
      'descriptionLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
      'descriptionLangEn':'All the services (phone, Internet and TV) are not working',
      'createdAt': '2020-07-03T07:23:44.601Z',
      'lastModified': '2020-07-03T04:08:27.349Z',
    }
  };
  let payloadAnswer = {
    'keyword':'-',
    'descriptionLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
    'descriptionLangEn':'All the services (phone, Internet and TV) are not working',
    'publishDate': '2021-12-31',
    'status': 'active'
  };
  let payloadPublishDateAnswer = {
    'keyword':'-',
    'descriptionLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
    'descriptionLangEn':'All the services (phone, Internet and TV) are not working',
    'status': 'active',
    'publishDate': '2021-02-01'
  };
  let payloadPublishDateAndInactiveAnswer = {
    'keyword':'-',
    'descriptionLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
    'descriptionLangEn':'All the services (phone, Internet and TV) are not working',
    'status': 'inactive',
    'publishDate': '2021-02-01'
  };
  describe('Topic', () => {
    describe('postTopic', () => {
      it('should return error icon must be [jpeg,jpg,png]', async() => {
        const result = await faqDB.postTopic(payloadTopicError);
        assert.equal(result.err.message, 'icon must be [jpeg,jpg,png]');
      });
      it('should return error background must be [jpeg,jpg,png]', async() => {
        const result = await faqDB.postTopic(payloadTopicBackgroundError);
        assert.equal(result.err.message, 'background must be [jpeg,jpg,png]');
      });
      it('should return error Topic faq already exist', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves({err: null, data: {}});
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(command.prototype, 'insertTopicFaq').resolves({err: true});
        const result = await faqDB.postTopic(payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.uploadImagesMinio.restore();
        command.prototype.insertTopicFaq.restore();
        assert.equal(result.err.message, 'Topic faq already exist');
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves({err: true});
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(command.prototype, 'insertTopicFaq').resolves({err: true});
        const result = await faqDB.postTopic(payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.uploadImagesMinio.restore();
        command.prototype.insertTopicFaq.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return Insert success', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves({err: true});
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(command.prototype, 'insertTopicFaq').resolves({err: null, data: {}});
        const result = await faqDB.postTopic(payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.uploadImagesMinio.restore();
        command.prototype.insertTopicFaq.restore();
        assert.equal(result.err, null);
      });
    });
    describe('updateTopic', () => {
      const topicResultsActive = {
        'err': null,
        'data': [
          {
            '_id': '5efedd00e67fb170dcf9336a',
            'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
            'categoryId': 'Internet',
            'categoryEn': 'Internet',
            'icon': 'internet.png',
            'status': 'active',
            'createdAt': '2020-07-03T07:23:44.601Z',
            'lastModified': '2020-07-03T04:08:27.349Z',
          },
          {
            '_id': '5efedd00e67fb170dcf9444a',
            'topicId': '5f3f664b-8992-4c34-b629-0341769c5699',
            'categoryId': 'Installation',
            'categoryEn': 'Installation',
            'icon': 'installation.png',
            'status': 'active',
            'createdAt': '2020-07-03T07:23:44.601Z',
            'lastModified': '2020-07-03T04:08:27.349Z',
          },
        ]
      };
      const topicResultsInctive = {
        'err': null,
        'data': [
          {
            '_id': '5efedd00e67fb170dcf9336a',
            'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
            'categoryId': 'Internet',
            'categoryEn': 'Internet',
            'icon': 'internet.png',
            'status': 'inactive',
            'createdAt': '2020-07-03T07:23:44.601Z',
            'lastModified': '2020-07-03T04:08:27.349Z',
          },
          {
            '_id': '5efedd00e67fb170dcf9444a',
            'topicId': '5f3f664b-8992-4c34-b629-0341769c5699',
            'categoryId': 'Installation',
            'categoryEn': 'Installation',
            'icon': 'installation.png',
            'status': 'inactive',
            'createdAt': '2020-07-03T07:23:44.601Z',
            'lastModified': '2020-07-03T04:08:27.349Z',
          },
        ]
      };
      it('should return Topic FAQ not found', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves({err: true});
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopic);
        query.prototype.findTopicFaq.restore();
        assert.equal(result.err.message, 'Topic FAQ not found');
      });
      it('should return error icon website/mobile must be [jpeg,jpg,png]', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopicError);
        query.prototype.findTopicFaq.restore();
        assert.equal(result.err.message, 'icon website/mobile must be [jpeg,jpg,png]');
      });
      it('should return error background website/mobile must be [jpeg,jpg,png]', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopicBackgroundError);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        assert.equal(result.err.message, 'background website/mobile must be [jpeg,jpg,png]');
      });
      it('should return findManySort error', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResultInactive);
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(query.prototype, 'findManySort').resolves({err:true});
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: null,data:{}});
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopicEmpty);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        query.prototype.findManySort.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result.err, null);
      });
      it('should return findManySort error', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResultInactive);
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(query.prototype, 'findManySort').resolves({err:true});
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: null,data:{}});
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        query.prototype.findManySort.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result.err, null);
      });
      it('should return uploadImagesMinio status topic inactive', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResultInactive);
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(query.prototype, 'findManySort').resolves(topicResultsInctive);
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: null,data:{}});
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        query.prototype.findManySort.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result.err, null);
      });
      it('should return uploadImagesMinio status topic active', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(query.prototype, 'findManySort').resolves(topicResultsActive);
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: null,data:{}});
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        query.prototype.findManySort.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result.err, null);
      });
      it('should return uploadImagesMinio success', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: null,data:{}});
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result.err, null);
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: true});
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return success', async() => {
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(Faq.prototype, 'uploadImagesMinio').resolves('http://urltoimage.co/image.jpg');
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: null});
        const result = await faqDB.updateTopic('5f3f664b-8992-4c34-b629-0341769c3178',payloadTopic);
        query.prototype.findTopicFaq.restore();
        Faq.prototype.removeImagesMinio.restore();
        Faq.prototype.uploadImagesMinio.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result.err, null);
      });
    });
    describe('removeTopic', () => {
      it('should return error The topic cannot be deleted, because it is used in the question', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: null});
        const result = await faqDB.removeTopic({topicId: '5f3f664b-8992-4c34-b629-0341769c3178'});
        query.prototype.findQuestionOne.restore();
        assert.equal(result.err.message, 'The topic cannot be deleted, because it is used in the question');
      });
      it('should return Topic FAQ not found', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
        sinon.stub(query.prototype, 'findTopicFaq').resolves({err: true});
        const result = await faqDB.removeTopic({topicId: '5f3f664b-8992-4c34-b629-0341769c3178'});
        query.prototype.findQuestionOne.restore();
        query.prototype.findTopicFaq.restore();
        assert.equal(result.err.message, 'Topic FAQ not found');
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        sinon.stub(command.prototype, 'removeTopic').resolves({err: true});
        const result = await faqDB.removeTopic({topicId: '5f3f664b-8992-4c34-b629-0341769c3178'});
        query.prototype.findQuestionOne.restore();
        query.prototype.findTopicFaq.restore();
        command.prototype.removeTopic.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return remove topic success', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
        sinon.stub(query.prototype, 'findTopicFaq').resolves(topicResult);
        sinon.stub(command.prototype, 'removeTopic').resolves({err: null});
        sinon.stub(Faq.prototype, 'removeImagesMinio').resolves('http://urltoimage.co/image.jpg');
        const result = await faqDB.removeTopic({topicId: '5f3f664b-8992-4c34-b629-0341769c3178'});
        query.prototype.findQuestionOne.restore();
        query.prototype.findTopicFaq.restore();
        command.prototype.removeTopic.restore();
        Faq.prototype.removeImagesMinio.restore();
        assert.equal(result.err, null);
      });
    });

    describe('updateTopicList', () => {
      const payload = {
        oldIndex:1,
        newIndex:0,
        updatedId:'88b33dcd-1680-433e-a9fe-8b9bd209b384',
        updatedName:'Super Administration'
      };
      const topicResults = {
        'err': null,
        'data': [
          {
            '_id': '5efedd00e67fb170dcf9336a',
            'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
            'categoryId': 'Internet',
            'categoryEn': 'Internet',
            'icon': 'internet.png',
            'imageMobile': {
              'icon': 'topic/mobile/icon/813b1ad4-97cd-44cb-af9b-b84be870a7b4.png',
              'background': 'topic/mobile/background/11be7332-dc6a-47ae-bd63-322455e41b4f.png'
            },
            'imageWebsite': {
              'icon': 'topic/website/icon/e169b280-61eb-42cf-954f-b82089b410b9.png',
              'background': 'topic/website/background/93f2acab-9297-4471-b086-1a888cf4ed7e.png'
            },
            'publishDate': '2020-12-27',
            'status': 'active',
            'position': 1,
            'createdAt': '2020-07-03T07:23:44.601Z',
            'lastModified': '2020-07-03T04:08:27.349Z',
          },
          {
            '_id': '5efedd00e67fb170dcf9444a',
            'topicId': '5f3f664b-8992-4c34-b629-0341769c5699',
            'categoryId': 'Installation',
            'categoryEn': 'Installation',
            'icon': 'installation.png',
            'imageMobile': {
              'icon': 'topic/mobile/icon/813b1ad4-97cd-44cb-af9b-b84be870a7b4.png',
              'background': 'topic/mobile/background/11be7332-dc6a-47ae-bd63-322455e41b4f.png'
            },
            'imageWebsite': {
              'icon': 'topic/website/icon/e169b280-61eb-42cf-954f-b82089b410b9.png',
              'background': 'topic/website/background/93f2acab-9297-4471-b086-1a888cf4ed7e.png'
            },
            'publishDate': '2020-12-27',
            'status': 'active',
            'position': 2,
            'createdAt': '2020-07-03T07:23:44.601Z',
            'lastModified': '2020-07-03T04:08:27.349Z',
          },
        ]
      };
      it('should return topic not result', async() => {
        sinon.stub(query.prototype, 'findManySort').resolves({err:true});
        const result = await faqDB.updateTopicList(payload);
        query.prototype.findManySort.restore();
        assert.equal(result.err.message, 'topic not result');
      });
      it('should return topic result undefined', async() => {
        sinon.stub(query.prototype, 'findManySort').resolves(topicResults);
        sinon.stub(command.prototype, 'upsertTopic').resolves({err: null});
        const result = await faqDB.updateTopicList(payload);
        query.prototype.findManySort.restore();
        command.prototype.upsertTopic.restore();
        assert.equal(result[0].err, undefined);
      });
    });
  });

  describe('Question', () => {
    describe('postQuestion', () => {
      it('should return error Publish date must be more than current date', async() => {
        const result = await faqDB.postQuestion(payloadPublisDateQuestion);
        assert.equal(result.err.message, 'Publish date must be more than current date');
      });
      it('should return error Topic FAQ not found', async() => {
        sinon.stub(query.prototype, 'findTopic').resolves({err: true});
        const result = await faqDB.postQuestion(payloadQuestion);
        query.prototype.findTopic.restore();
        assert.equal(result.err.message, 'Topic FAQ not found');
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findTopic').resolves(topicResult);
        sinon.stub(command.prototype, 'insertQuestion').resolves({err:true});
        const result = await faqDB.postQuestion(payloadQuestion);
        query.prototype.findTopic.restore();
        command.prototype.insertQuestion.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return success', async() => {
        sinon.stub(query.prototype, 'findTopic').resolves(topicResult);
        sinon.stub(command.prototype, 'insertQuestion').resolves({err: null, data:{}});
        const result = await faqDB.postQuestion(payloadQuestion);
        query.prototype.findTopic.restore();
        command.prototype.insertQuestion.restore();
        assert.equal(result.err, null);
      });
    });
    describe('updateQuestion', () => {
      it('should return error Publish date must be more than current date', async() => {
        const result = await faqDB.updateQuestion('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadPublisDateAndStatusInactiveQuestion);
        assert.equal(result.err.message, 'Publish date must be more than current date');
      });
      it('should return error FAQ question not found', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err:true});
        const result = await faqDB.updateQuestion('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadQuestion);
        query.prototype.findQuestionOne.restore();
        assert.equal(result.err.message, 'FAQ question not found');
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves(resultQuestion);
        sinon.stub(command.prototype, 'upsertQuestion').resolves({err:true});
        const result = await faqDB.updateQuestion('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadQuestion);
        query.prototype.findQuestionOne.restore();
        command.prototype.upsertQuestion.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return success', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves(resultQuestion);
        sinon.stub(command.prototype, 'upsertQuestion').resolves({err: null, data:{}});
        const result = await faqDB.updateQuestion('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadQuestion);
        query.prototype.findQuestionOne.restore();
        command.prototype.upsertQuestion.restore();
        assert.equal(result.err, null);
      });
    });
    describe('removeQuestion', () => {
      it('should return FAQ question not found', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
        sinon.stub(command.prototype, 'removeQuestion').resolves({err: true});
        const result = await faqDB.removeQuestion({faqId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
        query.prototype.findQuestionOne.restore();
        command.prototype.removeQuestion.restore();
        assert.equal(result.err.message, 'FAQ question not found');
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves(payloadQuestion);
        sinon.stub(command.prototype, 'removeQuestion').resolves({err: true});
        const result = await faqDB.removeQuestion({faqId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
        query.prototype.findQuestionOne.restore();
        command.prototype.removeQuestion.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return success', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves(payloadQuestion);
        sinon.stub(command.prototype, 'removeQuestion').resolves({err: null});
        const result = await faqDB.removeQuestion({faqId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
        query.prototype.findQuestionOne.restore();
        command.prototype.removeQuestion.restore();
        assert.equal(result.err, null);
      });
    });
  });

  describe('Answer', () => {
    describe('postAnswer', () => {
      it('should return error Publish date must be more than current date', async() => {
        const result = await faqDB.postAnswer(payloadPublishDateAndInactiveAnswer);
        assert.equal(result.err.message, 'Publish date must be more than current date');
      });
      it('should return Internal server error', async() => {
        sinon.stub(command.prototype, 'insertAnswer').resolves({err: true});
        const result = await faqDB.postAnswer(payloadAnswer);
        command.prototype.insertAnswer.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return success', async() => {
        sinon.stub(command.prototype, 'insertAnswer').resolves({err: null, data:{}});
        const result = await faqDB.postAnswer(payloadAnswer);
        command.prototype.insertAnswer.restore();
        assert.equal(result.err, null);
      });
    });
    describe('updateAnswer', () => {
      it('should return error Publish date must be more than current date', async() => {
        const result = await faqDB.updateAnswer('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadPublishDateAnswer);
        assert.equal(result.err.message, 'Publish date must be more than current date');
      });
      it('should return FAQ answer not found', async() => {
        sinon.stub(query.prototype, 'findAnswerOne').resolves({err:true});
        const result = await faqDB.updateAnswer('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadAnswer);
        query.prototype.findAnswerOne.restore();
        assert.equal(result.err.message, 'FAQ answer not found');
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findAnswerOne').resolves(answerResult);
        sinon.stub(command.prototype, 'upsertAnswer').resolves({err: true});
        const result = await faqDB.updateAnswer('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadAnswer);
        query.prototype.findAnswerOne.restore();
        command.prototype.upsertAnswer.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return success data empty', async() => {
        const payloadAnswerDataEmpty = {
          'keyword':'',
          'descriptionLangId':'',
          'descriptionLangEn':'',
          'publishDate': '2021-12-01',
          'status': ''
        };
        sinon.stub(query.prototype, 'findAnswerOne').resolves(answerResult);
        sinon.stub(command.prototype, 'upsertAnswer').resolves({err: null, data:{}});
        const result = await faqDB.updateAnswer('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadAnswerDataEmpty);
        query.prototype.findAnswerOne.restore();
        command.prototype.upsertAnswer.restore();
        assert.equal(result.err, null);
      });
      it('should return success', async() => {
        sinon.stub(query.prototype, 'findAnswerOne').resolves(answerResult);
        sinon.stub(command.prototype, 'upsertAnswer').resolves({err: null, data:{}});
        const result = await faqDB.updateAnswer('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', payloadAnswer);
        query.prototype.findAnswerOne.restore();
        command.prototype.upsertAnswer.restore();
        assert.equal(result.err, null);
      });
    });
    describe('removeAnswer', () => {
      it('should return error The answer cannot be deleted, because it is used in the question', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: null});
        const result = await faqDB.removeAnswer({answerId: '6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
        query.prototype.findQuestionOne.restore();
        assert.equal(result.err.message, 'The answer cannot be deleted, because it is used in the question');
      });
      it('should return FAQ answer not found', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
        sinon.stub(query.prototype, 'findAnswerOne').resolves({err: true});
        const result = await faqDB.removeAnswer({answerId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
        query.prototype.findQuestionOne.restore();
        query.prototype.findAnswerOne.restore();
        assert.equal(result.err.message, 'FAQ answer not found');
      });
      it('should return Internal server error', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
        sinon.stub(query.prototype, 'findAnswerOne').resolves(answerResult);
        sinon.stub(command.prototype, 'removeAnswer').resolves({err: true});
        const result = await faqDB.removeAnswer({answerId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
        query.prototype.findQuestionOne.restore();
        query.prototype.findAnswerOne.restore();
        command.prototype.removeAnswer.restore();
        assert.equal(result.err.message, 'Internal server error');
      });
      it('should return success', async() => {
        sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
        sinon.stub(query.prototype, 'findAnswerOne').resolves(answerResult);
        sinon.stub(command.prototype, 'removeAnswer').resolves({err: null});
        const result = await faqDB.removeAnswer({answerId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
        query.prototype.findQuestionOne.restore();
        query.prototype.findAnswerOne.restore();
        command.prototype.removeAnswer.restore();
        assert.equal(result.err, null);
      });
    });
  });

  describe('updatedListAnswer', () => {
    const payload = {
      questionId:'50b22beb-bb34-457f-99d0-7033573b2bc8',
      oldIndex:0,
      newIndex:1,
      updatedId:'9fa05627-4972-4984-aa93-0858dccda8e2',
      updatedName:'Super Administrator'
    };
    const questionResult = {
      err: null,
      data : {
        'questionId': '50b22beb-bb34-457f-99d0-7033573b2bc8',
        'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
        'subCategory': 'Troubleshooting',
        'titleLangId': 'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
        'titleLangEn': ' All the services (phone, Internet and TV) are not working',
        'answers': [{
          'answerId': 'd4bedc57-e9f1-45f2-936b-1d5bfe19de03',
          'number': 0
        }, {
          'answerId': '85e55328-baa0-4326-bede-bb3e93515d78',
          'number': 1
        }, {
          'answerId': '0850fb9b-013a-459b-a367-d70808f009a7',
          'number': 2
        }, {
          'answerId': '8a81ce0a-7c91-4942-981e-29118bb59468',
          'number': 3
        }],
        'publishDate': '2020-12-27',
        'status': 'active',
        'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'creatorName': 'Super Administrator',
        'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'updatedName': 'Super Administrator',
        'createdAt': '2020-12-27T08:21:46.696Z',
        'lastModified': '2020-12-27T08:21:46.696Z'
      }
    };
    it('should return question not found', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
      const result = await faqDB.updatedListAnswer(payload);
      query.prototype.findQuestionOne.restore();
      assert.equal(result.err.message, 'Question not found');
    });
    it('should return updatedListAnswer success', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(questionResult);
      sinon.stub(command.prototype, 'upsertQuestion').resolves({err: null, data:{}});
      const result = await faqDB.updatedListAnswer(payload);
      query.prototype.findQuestionOne.restore();
      command.prototype.upsertQuestion.restore();
      assert.equal(result[0].err, undefined);
    });
  });

  describe('removeListAnswer', () => {
    const payload = {
      questionId:'50b22beb-bb34-457f-99d0-7033573b2bc8',
      answerId: 'd4bedc57-e9f1-45f2-936b-1d5bfe19de03',
    };
    const questionResult = {
      err: null,
      data : [{
        'questionId': '50b22beb-bb34-457f-99d0-7033573b2bc8',
        'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
        'subCategory': 'Troubleshooting',
        'titleLangId': 'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
        'titleLangEn': ' All the services (phone, Internet and TV) are not working',
        'answers': [{
          'answerId': 'd4bedc57-e9f1-45f2-936b-1d5bfe19de03',
          'number': 0
        }, {
          'answerId': '85e55328-baa0-4326-bede-bb3e93515d78',
          'number': 1
        }, {
          'answerId': '0850fb9b-013a-459b-a367-d70808f009a7',
          'number': 2
        }, {
          'answerId': '8a81ce0a-7c91-4942-981e-29118bb59468',
          'number': 3
        }],
        'publishDate': '2020-12-27',
        'status': 'active',
        'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'creatorName': 'Super Administrator',
        'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'updatedName': 'Super Administrator',
        'createdAt': '2020-12-27T08:21:46.696Z',
        'lastModified': '2020-12-27T08:21:46.696Z'
      }]
    };
    it('should return question answer not found', async() => {
      sinon.stub(query.prototype, 'find').resolves({err: true});
      const result = await faqDB.removeListAnswer(payload);
      query.prototype.find.restore();
      assert.equal(result.err.message, 'question answer not found');
    });
    it('should return removeListAnswer success', async() => {
      sinon.stub(query.prototype, 'find').resolves(questionResult);
      sinon.stub(command.prototype, 'upsertQuestion').resolves({err: null, data:{}});
      const result = await faqDB.removeListAnswer(payload);
      query.prototype.find.restore();
      command.prototype.upsertQuestion.restore();
      assert.equal(result.err, null);
    });
    it('should return error removeListAnswer Internal server error', async() => {
      sinon.stub(query.prototype, 'find').resolves(questionResult);
      sinon.stub(command.prototype, 'upsertQuestion').resolves({err: true});
      const result = await faqDB.removeListAnswer(payload);
      query.prototype.find.restore();
      command.prototype.upsertQuestion.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
  });

  describe('uploadImagesMinio', () => {
    it('should success upload', async () => {
      const payload = {
        'image': {
          'size': 49805,
          'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
          'name': 'ktp.jpg',
          'type': 'image/jpeg',
          'mtime': '2020-04-24T07:41:07.309Z'
        },
        'type': 'selfi'
      };
      sinon.stub(minio, 'objectUpload').resolves({err: null});
      sinon.stub(fs, 'unlinkSync').resolves();
      const result = await faqDB.uploadImagesMinio(payload);
      minio.objectUpload.restore();
      fs.unlinkSync.restore();
      assert.notEqual(result, null);
    });
    it('should fail upload', async () => {
      const payload = {
        'image': {
          'size': 49805,
          'path': '/tmp/upload_064cf159a92a46e22259b503cc65fc8a',
          'name': 'ktp.jpg',
          'type': 'image/jpeg',
          'mtime': '2020-04-24T07:41:07.309Z'
        },
        'type': 'selfi'
      };
      sinon.stub(minio, 'objectUpload').resolves({err: true});
      const result = await faqDB.uploadImagesMinio(payload);
      minio.objectUpload.restore();
      assert.notEqual(result, null);
    });
  });

  describe('removeImagesMinio', () => {
    it('should should remove images success', async () => {
      sinon.stub(minio, 'objectRemove').resolves({err: null});
      const result = await faqDB.removeImagesMinio({bucket: 'topic', directory:'mobile/icon', name: 'alalalal.png' });
      minio.objectRemove.restore();
      assert.notEqual(result.err, 'true');
    });
    it('should error remove images', async () => {
      sinon.stub(minio, 'objectRemove').resolves({err: true});
      const result = await faqDB.removeImagesMinio({bucket: 'topic', directory:'mobile/icon', name: 'alalalal.png' });
      minio.objectRemove.restore();
      assert.notEqual(result.err, 'true');
    });
  });

  describe('move array', () => {
    it('should success move array', async () => {
      const result = await faqDB.move(['myindie','home'], 0, 1);
      assert.notEqual(result, [ 'home', 'myindie' ]);
    });
    it('should error undefined', async () => {
      const result = await faqDB.move(['myindie','home'], 0, 2);
      assert.notEqual(result, [ 'home', undefined, 'myindie' ]);
    });
  });
});


