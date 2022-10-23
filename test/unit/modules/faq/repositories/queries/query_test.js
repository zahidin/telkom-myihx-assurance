
const assert = require('assert');
const sinon = require('sinon');
const Query = require('../../../../../../bin/modules/faq/repositories/queries/query');

describe('FAQ - Query', () => {
  it('find', async() => {
    const db = {
      setCollection: sinon.stub(),
      findMany: sinon.stub().resolves({
        'err': null,
        'data': [
          {
            '_id': '5f60c7b6832a33396c3c82b8',
            'questionId': '3f664b5f-82c3-4994-b629-03317841769c',
            'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
            'subCategory': 'Troubleshooting',
            'titleLangId': 'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
            'titleLangEn': 'All the services (phone, Internet and TV) are not working',
            'answers': [
              {
                'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
                'number': 0
              },
              {
                'answerId': 'c4e96887-e40e-4404-af5d-90218645959e',
                'number': 1
              }
            ],
            'createdAt': '2020-09-15T13:55:02.609Z',
            'lastModified': '2020-09-15T13:55:02.609Z'
          }
        ]
      })
    };
    const query = new Query(db);
    const result = await query.find();
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
  });

  it('findAnswer', async() => {
    const dbs = {
      setCollection: sinon.stub(),
      findMany: sinon.stub().resolves({
        'err': null,
        'data': [
          {
            '_id': '5f60c7b6832a33396c3c82b8',
            'answerId': 'c4e96887-e40e-4404-af5d-90218645959e',
            'keywords': '-',
            'descriptionLangId': '<h3>Layanan mungkin di non-aktifkan untuk sementara waktu<h3>.',
            'descriptionLangEn': '<h3>Service may be temporarily deactivated</h3>.',
            'createdAt': '2020-09-15T13:55:02.609Z',
            'lastModified': '2020-09-15T13:55:02.609Z'
          },
          {
            '_id': '5f60c7b6832a33396c3c82b8',
            'answerId': '5f3f4c34-664b-8992-b629-0341769c3178',
            'keywords': '-',
            'descriptionLangId': '<h3>Layanan mungkin di non-aktifkan untuk sementara waktu<h3>.',
            'descriptionLangEn': '<h3>Service may be temporarily deactivated</h3>.',
            'createdAt': '2020-09-15T13:55:02.609Z',
            'lastModified': '2020-09-15T13:55:02.609Z'
          }
        ]
      })
    };
    const query = new Query(dbs);
    const result = await query.findAnswer({answerId: 'c4e96887-e40e-4404-af5d-90218645959e'});
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].answerId, 'c4e96887-e40e-4404-af5d-90218645959e');
  });

  it('findAll', async() => {
    const db = {
      setCollection: sinon.stub(),
      findMany: sinon.stub().resolves({
        'err': null,
        'data': [
          {
            _id: '5f087c3490c4a89aa42d72c2',
            topicId: 'e4acc918-e1f1-4e10-9cd2-ede0bde7cf24',
          },
        ]
      })
    };
    const query = new Query(db);
    const result = await query.findAll();
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].topicId, 'e4acc918-e1f1-4e10-9cd2-ede0bde7cf24');
  });

  it('findAssurance', async() => {
    const db = {
      setCollection: sinon.stub(),
      findMany: sinon.stub().resolves({
        'err': null,
        'data':{
          '_id': '5edd7def0c624c501c2126b0',
          'symptomId': 'b8f83073-092e-4473-ab47-a3df613907f5',
          'type': 'Internet',
          'descriptionId': 'Telepon, Internet dan IndiHome TV tidak dapat berfungsi',
          'descriptionEn': 'All services (phone, Internet and TV) are not working',
          'technicalLanguage': 'Tidak Bisa Browsing - 2P / 3P Mati Total',
          'fiber': [Object],
          'copper': [Object]
        }
      })
    };
    const query = new Query(db);
    const result = await query.findAssurance({type: 'Internet'});
    assert.notEqual(result.data, null);
    assert.equal(result.data.type, 'Internet');
  });

  it('findAssuranceSort', async() => {
    const db = {
      setCollection: sinon.stub(),
      findManySortByScore: sinon.stub().resolves({
        'err': null,
        'data': {
          'reserveId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c'
        }
      })
    };
    const query = new Query(db);
    const result = await query.findAssuranceSort({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.reserveId, 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c');
  });

  it('createIndex', async() => {
    const db = {
      setCollection: sinon.stub(),
      createIndex: sinon.stub().resolves({
        'err': null,
        'data': {}
      })
    };
    const query = new Query(db);
    const result = await query.createIndex({});
    assert.notEqual(result.data, null);
  });

  it('findTopic', async() => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data': {
          '_id': '5efedd00e67fb170dcf9336a',
          'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
          'categoryId': 'Internet',
          'categoryEn': 'Internet',
          'icon': 'internet.png',
          'createdAt': '2020-07-03T07:23:44.601Z',
          'lastModified': '2020-07-03T04:08:27.349Z',
        },
      })
    };
    const query = new Query(db);
    const result = await query.findTopic('5f3f664b-8992-4c34-b629-0341769c3178');
    assert.notEqual(result.data, null);
    assert.equal(result.data.topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
  });

  it('findTopicFaq', async() => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data': {
          '_id': '5efedd00e67fb170dcf9336a',
          'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
          'categoryId': 'Internet',
          'categoryEn': 'Internet',
          'icon': 'internet.png',
          'createdAt': '2020-07-03T07:23:44.601Z',
          'lastModified': '2020-07-03T04:08:27.349Z',
        },
      })
    };
    const query = new Query(db);
    const result = await query.findTopicFaq({topicId: '5f3f664b-8992-4c34-b629-0341769c3178'});
    assert.notEqual(result.data, null);
    assert.equal(result.data.topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
  });

  it('findPSB', async() => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data': {
          'reserveId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c'
        }
      })
    };
    const query = new Query(db);
    const result = await query.findPSB({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.reserveId, 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c');
  });

  it('findManyAccount', async() => {
    const db = {
      setCollection: sinon.stub(),
      findMany: sinon.stub().resolves({
        'err': null,
        'data': {
          'reserveId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c'
        }
      })
    };
    const query = new Query(db);
    const result = await query.findManyAccount({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.reserveId, 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c');
  });

  it('findQuestionOne', async() => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data': {
          '_id': '5efedd00e67fb170dcf9336a',
          'questionId':'6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
          'topicId':'5f3f664b-8992-4c34-b629-0341769c3178',
          'subCategory':'Troubleshooting',
          'titleLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
          'titleLangEn':'All the services (phone, Internet and TV) are not working',
          'answers':[
            {
              'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
              'number': 0
            },
            {
              'answerId': 'c4e96887-e40e-4404-af5d-90218645959e',
              'number': 1
            }
          ],
          'createdAt': '2020-07-03T07:23:44.601Z',
          'lastModified': '2020-07-03T04:08:27.349Z',
        }
      })
    };
    const query = new Query(db);
    const result = await query.findQuestionOne({questionId: '6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
    assert.notEqual(result.data, null);
    assert.equal(result.data.topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
  });

  it('findQuestion', async() => {
    const db = {
      setCollection: sinon.stub(),
      findAllData: sinon.stub().resolves({
        'err': null,
        'data': [{
          '_id': '5efedd00e67fb170dcf9336a',
          'questionId':'6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
          'topicId':'5f3f664b-8992-4c34-b629-0341769c3178',
          'subCategory':'Troubleshooting',
          'titleLangId':'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
          'titleLangEn':'All the services (phone, Internet and TV) are not working',
          'answers':[
            {
              'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
              'number': 0
            },
            {
              'answerId': 'c4e96887-e40e-4404-af5d-90218645959e',
              'number': 1
            }
          ],
          'createdAt': '2020-07-03T07:23:44.601Z',
          'lastModified': '2020-07-03T04:08:27.349Z',
        }]
      })
    };
    const query = new Query(db);
    const result = await query.findQuestion({questionId: '6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
  });

  it('findAnswerOne', async() => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data': {
          '_id': '5efedd00e67fb170dcf9336a',
          'answerId': '6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
          'keywords':'-',
          'descriptionLangId':'<h3>Layanan mungkin di non-aktifkan untuk sementara waktu<h3><br><p>Ak...',
          'descriptionLangEn':'<h3>Service may be temporarily deactivated</h3><p>Your Indihome servic...',
          'createdAt': '2020-07-03T07:23:44.601Z',
          'lastModified': '2020-07-03T04:08:27.349Z',
        }
      })
    };
    const query = new Query(db);
    const result = await query.findAnswerOne({answerId: '6460a229-3ce7-4c6a-bc2d-252e1f88ade3'});
    assert.notEqual(result.data, null);
    assert.equal(result.data.answerId, '6460a229-3ce7-4c6a-bc2d-252e1f88ade3');
  });

  it('countOnboarding', async() => {
    const db = {
      setCollection: sinon.stub(),
      countData: sinon.stub().resolves({
        'err': null,
        'data': [{
          'onboardingId': '0b3c9460-ada1-43e9-9a74-125c83c27a68',
          'id': {
            'title': 'Kedua s',
            'description': 'Kedua s'
          },
          'en': {
            'title': 'Kedua s',
            'description': 'Kedua s'
          },
          'publish': '2020-11-17',
          'status': 'inactive',
          'image': 'onboarding/9f40f017-2c60-40e5-b831-2a4718d62da7.png',
          'creatorId': '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
          'creatorName': 'Khalima',
          'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
          'updatedName': 'Super Administrator',
          'position': 0,
          'createdAt': '2020-11-20T06:25:07.814Z',
          'lastModified': '2021-01-06T07:34:26.754Z',
          'dueDate': '2020-11-17'
        }]
      })
    };
    const query = new Query(db);
    const result = await query.countOnboarding({});
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].onboardingId, '0b3c9460-ada1-43e9-9a74-125c83c27a68');
  });

  it('findAllQuestion', async() => {
    const db = {
      setCollection: sinon.stub(),
      findMany: sinon.stub().resolves({
        'err': null,
        'data': [
          {
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
        ]
      })
    };
    const query = new Query(db);
    const result = await query.findAllQuestion();
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].questionId, '50b22beb-bb34-457f-99d0-7033573b2bc8');
  });

  it('countQuestion', async() => {
    const db = {
      setCollection: sinon.stub(),
      countData: sinon.stub().resolves({
        'err': null,
        'data': [{
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
      })
    };
    const query = new Query(db);
    const result = await query.countQuestion({});
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].questionId, '50b22beb-bb34-457f-99d0-7033573b2bc8');
  });

  it('countAnswer', async() => {
    const db = {
      setCollection: sinon.stub(),
      countData: sinon.stub().resolves({
        'err': null,
        'data': [{
          'answerId': 'd4bedc57-e9f1-45f2-936b-1d5bfe19de03',
          'keywords': '',
          'descriptionLangId': '<h3>Layanan mungkin di non-aktifkan untuk sementara waktu</h3>.',
          'descriptionLangEn': '<h3>Service may be temporarily deactivated</h3>.',
          'publishDate': '2020-12-27',
          'status': 'active',
          'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
          'creatorName': 'Super Administrator',
          'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
          'updatedName': 'Super Administrator',
          'createdAt': '2020-12-27T08:20:59.346Z',
          'lastModified': '2020-12-27T08:20:59.346Z'
        }]
      })
    };
    const query = new Query(db);
    const result = await query.countAnswer({});
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].answerId, 'd4bedc57-e9f1-45f2-936b-1d5bfe19de03');
  });
});
