const assert = require('assert');
const sinon = require('sinon');
const Query = require('../../../../../../bin/modules/issues/repositories/queries/query');

describe('Assurance query', () => {
  const parameter = {
    'type': 'Internet'
  };

  const db = {
    setCollection: sinon.stub(),
    findMany: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5edd7def0c624c501c2126b0',
        'symptomId': 'b8f83073-092e-4473-ab47-a3df613907f5',
        'type': 'Internet',
        'descriptionId': 'Telepon, Internet dan IndiHome TV tidak dapat berfungsi',
        'descriptionEn': 'All services (phone, Internet and TV) are not working',
        'technicalLanguage': 'Tidak Bisa Browsing - 2P / 3P Mati Total',
        'fiber': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'copper': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'createdAt': '2020-06-06T10:05:09.006Z',
        'lastModified': '2020-06-06T10:05:09.006Z'
      }
    })
  };

  const aggregate = {
    setCollection: sinon.stub(),
    aggregateData: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': {
          'type': 'ADMINISTRATION'
        }
      },
    })
  };

  it('should return success', async() => {
    const query = new Query(aggregate);
    const result = await query.findAll([{ $group: { '_id': {'type': '$type'} } }]);
    assert.notEqual(result.data, null);
    assert.equal(result.data._id.type, 'ADMINISTRATION');
  });

  it('should return success by type assurance Internet', async() => {
    const query = new Query(db);
    const result = await query.getIssuesByType(parameter);
    assert.notEqual(result.data, null);
    assert.equal(result.data.symptomId, 'b8f83073-092e-4473-ab47-a3df613907f5');
    assert.equal(result.data.type, 'Internet');
  });
});

describe('Assurance issue by issue id', () => {
  const db = {
    setCollection: sinon.stub(),
    findOne: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5edd7def0c624c501c2126b0',
        'symptomId': 'b8f83073-092e-4473-ab47-a3df613907f5',
        'type': 'Internet',
        'descriptionId': 'Telepon, Internet dan IndiHome TV tidak dapat berfungsi',
        'descriptionEn': 'All services (phone, Internet and TV) are not working',
        'technicalLanguage': 'Tidak Bisa Browsing - 2P / 3P Mati Total',
        'fiber': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'copper': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'createdAt': '2020-06-06T10:05:09.006Z',
        'lastModified': '2020-06-06T10:05:09.006Z'
      },
      'message': 'Get categories by type successfull',
    })
  };

  it('should return success by get issue by id', async() => {
    const query = new Query(db);
    const result = await query.getIssuesId('b8f83073-092e-4473-ab47-a3df613907f5');
    assert.notEqual(result.data, null);
    assert.equal(result.data.symptomId, 'b8f83073-092e-4473-ab47-a3df613907f5');
    assert.equal(result.data.type, 'Internet');
  });

  it('should return get categories by type successfull', async() => {
    const query = new Query(db);
    const result = await query.getIssuesId('b8f83073-092e-4473-ab47-a3df613907f5');
    assert.notEqual(result.data, null);
    assert.equal(result.data.descriptionId, 'Telepon, Internet dan IndiHome TV tidak dapat berfungsi');
  });
});

describe('Additional Comment query', () => {
  const db = {
    setCollection: sinon.stub(),
    findMany: sinon.stub().resolves({
      'err': null,
      'data': [{
        '_id': '5ee85d46ce6fd650c86016fd',
        'issueId': 'MYINX-15916671112341',
        'assetNum': '50014277_131184115030_INTERNET',
        'psbAccount':
          {
            'indihomeNumber': '131184115030',
            'ncli': '50014277',
            'telephoneNumber': '02154520122'
          },
        'userId': '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        'symptom':
          {
            'symptomId': 'b8f83073-092e-4473-ab47-a3df613907f5',
            'clasificationId': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
            'isFiber': 'Fiber',
            'iBooster': {}
          },
        'issueType': 'INTERNET',
        'ticketType': 'Fisik',
        'message': 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
        'status': 'close',
        'schedule':
          {
            'bookingId': '1592286844074_6',
            'scheduleAttempt': 0,
            'timeBox': '2020-09-11T02:33:31.078+00:00',
            'timeSlot': [Object],
            'availability': 1,
            'crewId': 'A2BIN010',
            'information': 'Crew pada STO terdekat',
            'contactSecondary': null
          },
        'createdAt': '2020-06-16T05:48:54.982Z',
        'lastModified': '2020-06-16T05:55:09.963Z',
        'work': 'ASSIGNED',
        'comments': [
          {
            'comment': 'Test pertama',
            'createdAt': '2020-07-06T04:07:21.796+00:00'
          },
          {
            'comment': 'Test kedua',
            'createdAt': '2020-07-06T04:07:21.796+00:00'
          },
          {
            'comment': 'Test Ketiga',
            'createdAt': '2020-07-06T04:07:21.796+00:00'
          }
        ],
        'ticketId': 'IN123456',
        'technician': {
          'personId':'TAW2JAKSEL_103',
          'displayName':'JUFRIYANTO',
          'email':'jufryanto@gmail.com',
          'phone':'081285399618'
        }
      }]
    })
  };

  it('should return success comments by issueId', async() => {
    const query = new Query(db);
    const result = await query.findIssues({ issueId: 'MYINX-15916671112341' });
    assert.notEqual(result.data, null);
    assert.equal(result.data[0].issueId, 'MYINX-15916671112341');
  });
});

describe('findManyAccount', () => {
  const db = {
    setCollection: sinon.stub(),
    findMany: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5bac53b45ea76b1e9bd58e1c',
        'userId': '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        'fullName': 'Farid Tri Wicaksono',
        'mobileNumber': '085646006937',
        'email': 'putrafarid93@gmail.com',
        'role': 'user',
        'isActive': true,
        'deviceId': '',
        'accounts': [{'indihomeNumber':'123456789','status':'active'}],
        'token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9xxxx',
        'verifyForgotPassword': false,
        'createdAt': '1586408579555',
        'lastModified': '1586408579555',
        'profilePicture': 'http://minio-palapaone-dev.vsan-apps.playcourt.id/palapaone/users/default_profile_picture.jpeg'
      }
    })
  };

  it('should return success', async() => {
    const query = new Query(db);
    const result = await query.findManyAccount({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.fullName, 'Farid Tri Wicaksono');
  });
});

describe('findOneUser', () => {
  const db = {
    setCollection: sinon.stub(),
    findOne: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5bac53b45ea76b1e9bd58e1c',
        'userId': '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        'fullName': 'Farid Tri Wicaksono',
        'mobileNumber': '085646006937',
        'email': 'putrafarid93@gmail.com',
        'role': 'user',
        'isActive': true,
        'deviceId': '',
        'accounts': [{'indihomeNumber':'123456789','status':'active'}],
        'token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9xxxx',
        'verifyForgotPassword': false,
        'createdAt': '1586408579555',
        'lastModified': '1586408579555',
        'profilePicture': 'http://minio-palapaone-dev.vsan-apps.playcourt.id/palapaone/users/default_profile_picture.jpeg'
      }
    })
  };

  it('should return success', async() => {
    const query = new Query(db);
    const result = await query.findOneUser({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.fullName, 'Farid Tri Wicaksono');
  });
});

describe('findOneModem', () => {
  const db = {
    setCollection: sinon.stub(),
    findOne: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5bac53b45ea76b1e9bd58e1c',
        'userId': '6ab03422-a8f6-42dd-94df-af0344478a7d',
        'indihomeNumber': '122604200712',
        'rebootTime': '2020-06-16T13:43:31.524+00:00',
        'createdAt': '2020-06-12T08:01:10.934+00:00'
      }
    })
  };

  it('should return success', async() => {
    const query = new Query(db);
    const result = await query.findOneModem({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.indihomeNumber, '122604200712');
  });
});

describe('findAssurance', () => {
  const db = {
    setCollection: sinon.stub(),
    findOne: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5edd7def0c624c501c2126b0',
        'symptomId': 'b8f83073-092e-4473-ab47-a3df613907f5',
        'type': 'Internet',
        'descriptionId': 'Telepon, Internet dan IndiHome TV tidak dapat berfungsi',
        'descriptionEn': 'All services (phone, Internet and TV) are not working',
        'technicalLanguage': 'Tidak Bisa Browsing - 2P / 3P Mati Total',
        'fiber': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'cooper': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'createdAt': '2020-06-06T10:05:09.006Z',
        'lastModified': '2020-06-06T10:05:09.006Z'
      }
    })
  };
  it('should return success', async() => {
    const query = new Query(db);
    const result = await query.findAssurance({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.symptomId, 'b8f83073-092e-4473-ab47-a3df613907f5');
  });
});

describe('findSymptom', () => {
  const db = {
    setCollection: sinon.stub(),
    findOne: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5edd7def0c624c501c2126b0',
        'symptomId': 'b8f83073-092e-4473-ab47-a3df613907f5',
        'type': 'Internet',
        'descriptionId': 'Telepon, Internet dan IndiHome TV tidak dapat berfungsi',
        'descriptionEn': 'All services (phone, Internet and TV) are not working',
        'technicalLanguage': 'Tidak Bisa Browsing - 2P / 3P Mati Total',
        'fiber': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'cooper': {
          'classificationId3Spec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          'classificationId3UnderSpec': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        'createdAt': '2020-06-06T10:05:09.006Z',
        'lastModified': '2020-06-06T10:05:09.006Z'
      }
    })
  };

  it('should return success', async() => {
    const query = new Query(db);
    const result = await query.findSymptom({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.symptomId, 'b8f83073-092e-4473-ab47-a3df613907f5');
  });
});

describe('findPSB', () => {
  const db = {
    setCollection: sinon.stub(),
    findOne: sinon.stub().resolves({
      'err': null,
      'data': {
        '_id': '5ee85d46ce6fd650c86016fd',
        'issueId': 'MYINX-15916671112341',
        'assetNum': '50014277_131184115030_INTERNET',
        'psbAccount':
          {
            'indihomeNumber': '131184115030',
            'ncli': '50014277',
            'telephoneNumber': '02154520122'
          },
        'userId': '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        'symptom':
          {
            'symptomId': '3321d467-b759-4bf9-8e5b-bd3ec1a0d7bc',
            'clasificationId': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
            'isFiber': 'Fiber',
            'iBooster': {}
          },
        'issueType': 'INTERNET',
        'ticketType': 'Fisik',
        'message': 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
        'status': 'close',
        'schedule':
          {
            'bookingId': '1592286844074_6',
            'scheduleAttempt': 0,
            'timeBox': null,
            'timeSlot': [Object],
            'availability': 1,
            'crewId': 'A2BIN010',
            'information': 'Crew pada STO terdekat',
            'contactSecondary': null
          },
        'createdAt': '2020-06-16T05:48:54.982Z',
        'lastModified': '2020-06-16T05:55:09.963Z',
        'work': 'RESOLVED'
      }
    })
  };

  it('should return success', async() => {
    const query = new Query(db);
    const result = await query.findPSB({});
    assert.notEqual(result.data, null);
    assert.equal(result.data.schedule.bookingId, '1592286844074_6');
  });
});
