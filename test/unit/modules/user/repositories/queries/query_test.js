const assert = require('assert');
const sinon = require('sinon');
const Query = require('../../../../../../bin/modules/user/repositories/queries/query');

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

describe('findIssue', () => {
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
            'telephoneNumber': '02154520122',
            'sto':'BOO',
            'address':'Komp. TAMAN PAJAJARAN 000 ,KATULAMPA Kec.BOGOR TIMUR,BOGOR - 16144 ',
            'installationDate':'2015-04-03',
            'transactionId':'',
            'crewId':'CREWMIHX'
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
      }
    })
  };
  it('should return success', async() => {
    const query = new Query(db);
    const result = await query.findIssue('MYINX-15916671112341');
    assert.notEqual(result.data, null);
    assert.equal(result.data.issueId, 'MYINX-15916671112341');
  });
});

describe('findById', () => {
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
    const result = await query.findById('5bac53b45ea76b1e9bd58e1c');
    assert.notEqual(result.data, null);
    assert.equal(result.data.fullName, 'Farid Tri Wicaksono');
  });

  describe('findOneAccount', () => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data': {
          'indihomeNumber': '081222133145',
          'ncli': '50015135',
          'phoneNumber': '02183793268',
          'locId': '',
          'users': [{
            'userId': '2b6e6b61-eb34-46d9-ba1c-ae22913273fz',
            'portfolioId': '',
            'svmLevel': 2,
            'createdAt': '2020-07-15T09:02:33.788+07:00',
            'lastModified': '2020-08-18T13:40:21.947+07:00',
            'isPrimary': true,
            'status': 'active',
            'isDefault': true
          }, {
            'userId': '31ad216-d949-487a-8b7b-9bf21817b2b4',
            'portfolioId': '',
            'status': 'active',
            'svmLevel': 0,
            'isPrimary': false,
            'isDefault': true,
            'createdAt': '2020-09-17T11:55:18.745+07:00',
            'lastModified': '2020-09-21T08:15:45.693+07:00'
          }],
          'createdAt': '2020-07-15T09:02:33.788+07:00',
          'lastModified': '2020-09-15T11:41:38.106+07:00'
        }
      })
    };
    it('should return success', async() => {
      const query = new Query(db);
      const result = await query.findOneAccount({});
      assert.notEqual(result.data, null);
      assert.equal(result.data.indihomeNumber, '081222133145');
    });
  });
});
