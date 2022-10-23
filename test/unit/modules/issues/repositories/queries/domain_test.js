const Assurance = require('../../../../../../bin/modules/issues/repositories/queries/domain');
const query = require('../../../../../../bin/modules/issues/repositories/queries/query');
const sinon = require('sinon');
const assert = require('assert');
const logger = require('../../../../../../bin/helpers/utils/logger');
const commonUtil = require('../../../../../../bin/helpers/utils/common');
const service = require('../../../../../../bin/modules/issues/utils/service');
const command = require('../../../../../../bin/modules/issues/repositories/commands/command');
const Redis = require('../../../../../../bin/helpers/databases/redis/redis');
describe('Domain issue query', () => {

  const db = {
    setCollection: sinon.stub()
  };

  const assurance = new Assurance(db);
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

  const responseJwt = {
    data: 'eb457622b6fd2231e522befeebf0278f5d8875ebxxxx'
  };

  let issueResult = {
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
  };

  let issueResults = {
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
      'work': 'RESOLVED',
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
  };

  let assuranceResult = {
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
  };

  let userResult = {
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
  };

  let technicianResult = {
    'statusCode': '0',
    'returnMessage': 'success',
    'data': {
      'AMCREWLABOR': [
        {
          'AMCREW': 'A2BIN003',
          'ORGID': 'TELKOM',
          'LABOR': [
            {
              'LABORCODE': 'TAW2JAKSEL_114',
              'LABORID': '76902',
              'WORKLOCATION': 'TECH_ASR_COPPER',
              'PERSON': [
                {
                  'ADDRESSLINE1': 'JL. LEBAK BULUS TENGAH NO 2 CILANDAK',
                  'COUNTRY': 'ID',
                  'DISPLAYNAME': 'DANU SISWOYO',
                  'LOCATIONSITE': 'REG-2',
                  'PERSONID': 'TAW2JAKSEL_114',
                  'PRIMARYEMAIL': '',
                  'PRIMARYPHONE': '081285399615',
                  'PRIMARYSMS': '',
                  'STATEPROVINCE': 'JAKARTA',
                  'STATUS': 'ACTIVE',
                  'SUPERVISOR': 'RISQ92140129'
                }
              ]
            },
            {
              'LABORCODE': '15893775',
              'LABORID': '76903',
              'WORKLOCATION': 'TECH_ASR_FIBER',
              'PERSON': [
                {
                  'ADDRESSLINE1': 'BINTARO',
                  'COUNTRY': 'INDONESIA',
                  'DISPLAYNAME': 'IMAM ALMALIBARI - 15893775 TEK MYI JAKARTA SELATAN',
                  'LOCATIONSITE': 'REG-2',
                  'PERSONID': '15893775',
                  'PRIMARYEMAIL': '',
                  'PRIMARYPHONE': '+682112871624',
                  'PRIMARYSMS': '+682112871624',
                  'STATEPROVINCE': 'JAKARTA SELATAN',
                  'STATUS': 'ACTIVE',
                  'SUPERVISOR': 'RISQ92140129'
                }
              ]
            }
          ]
        }
      ]
    }
  };

  describe('getCategories', () => {
    it('should return categories data', async () => {
      let queryResult = {
        'err': null,
        'data': [
          {
            '_id': [Object]
          },
        ]
      };
      sinon.stub(query.prototype, 'findAll').resolves(queryResult);
      const result = await assurance.getCategories('id');
      assert.equal(result.data.length, 1);
      query.prototype.findAll.restore();
    });

    it('should return categories error', async () => {
      let queryResult = {
        'err': true,
        'data': null
      };

      sinon.stub(query.prototype, 'findAll').resolves(queryResult);
      const result = await assurance.getCategories('id');
      query.prototype.findAll.restore();
      assert.equal(result.err.message, 'Data not found');
    });
  });

  describe('issueType', () => {
    it('should return issueType IPTV', async () => {
      const result = await assurance.issueType('TV');
      assert.equal(result, 'IPTV');
    });
    it('should return issueType Telephone', async () => {
      const result = await assurance.issueType('Telephone');
      assert.equal(result, 'VOICE');
    });
    it('should return issueType INTERNET', async () => {
      const result = await assurance.issueType('Internet');
      assert.equal(result, 'INTERNET');
    });
  });

  describe('getIssuesByType', () => {
    let queryResults = {
      'err': null,
      'data': [
        {
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
        },
      ]
    };
    it('should return issues by category id', async () => {
      sinon.stub(query.prototype, 'getIssuesByType').resolves(queryResults);
      const result = await assurance.getIssuesByType('Internet', 'id');
      assert.equal(result.data.length, 1);
      query.prototype.getIssuesByType.restore();
    });

    it('should return issues by category en', async () => {
      sinon.stub(query.prototype, 'getIssuesByType').resolves(queryResults);
      const result = await assurance.getIssuesByType('Internet', 'en');
      assert.equal(result.data.length, 1);
      query.prototype.getIssuesByType.restore();
    });

    it('should return type issue error', async () => {
      let queryResult = {
        'err': true,
        'data': null
      };

      sinon.stub(query.prototype, 'getIssuesByType').resolves(queryResult);
      const result = await assurance.getIssuesByType('Internet', 'id');
      query.prototype.getIssuesByType.restore();
      assert.equal(result.err.message, 'Can not find categories');
    });
  });

  describe('getIssuesId', () => {
    it('should return issue data id', async () => {
      sinon.stub(query.prototype, 'getIssuesId').resolves(assuranceResult);
      const result = await assurance.getIssuesId('b8f83073-092e-4473-ab47-a3df613907f5', 'id');
      query.prototype.getIssuesId.restore();
      assert.equal(result.data[0].issueType, 'INTERNET');
    });
    it('should return issue data en', async () => {
      sinon.stub(query.prototype, 'getIssuesId').resolves(assuranceResult);
      const result = await assurance.getIssuesId('b8f83073-092e-4473-ab47-a3df613907f5', 'en');
      query.prototype.getIssuesId.restore();
      assert.equal(result.data[0].issueType, 'INTERNET');
    });
    it('should return issue error', async () => {
      let queryResult = {
        'err': true,
        'data': null
      };

      sinon.stub(query.prototype, 'getIssuesId').resolves(queryResult);
      const result = await assurance.getIssuesId('Telephone', 'id');
      query.prototype.getIssuesId.restore();
      assert.equal(result.err.message, 'Can not find categories');
    });
  });
  describe('getCommentByIssueId', () => {
    it('should return Comment By IssueId', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      const result = await assurance.getCommentByIssueId('MYINX-15916671112341');
      query.prototype.findIssue.restore();
      assert.equal(result.data[0].message, 'Test Ketiga');
    });
  });

  describe('getScheduleAvailability', () => {
    const payload = {
      userId:'9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      lang:'id'
    };
    const userResult = {
      err: null,
      data: {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        fullName: 'Farid Tri Wicaksono',
        mobileNumber: '085646006937',
        email: 'putrafarid93@gmail.com',
        role: 'user',
        isActive: true,
        deviceId: '',
      }
    };

    const issue = {
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
            'installationDate':'2020-11-16',
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
        'status': 'pending',
        'schedule': '',
        'createdAt': '2020-11-18T05:48:54.982Z',
        'lastModified': '2020-11-18T05:55:09.963Z'
      }
    };
    it('should return error didnt get jwt', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await assurance.getScheduleAvailability(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return Ticket not found', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.getScheduleAvailability(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return User doesn\'t have privilege', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.getScheduleAvailability(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'User doesn\'t have privilege to perform this action. Required an active package');
    });
    it('should return error upsertIssue', async () => {
      const availableDate = {
        data: [
          {
            'dateTime': '01-12-2020 08:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_0',
            'timeSlot': {
              'slotId': 'early-morning',
              'slot': '8:00 - 10:00',
              'time': '08:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'early-morning'
          },
          {
            'dateTime': '01-12-2020 10:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_2',
            'timeSlot': {
              'slotId': 'morning',
              'slot': '10:00 - 12:00',
              'time': '10:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'morning'
          },
          {
            'dateTime': '01-12-2020 13:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_4',
            'timeSlot': {
              'slotId': 'noon',
              'slot': '13:00 - 15:00',
              'time': '13:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'noon'
          }
        ]
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(Redis.prototype, 'getData').resolves(null);
      sinon.stub(Assurance.prototype, 'getStartAndEndInMonth').resolves(availableDate);
      sinon.stub(Redis.prototype, 'setDataEx');
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await assurance.getScheduleAvailability(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      Redis.prototype.getData.restore();
      Redis.prototype.setDataEx.restore();
      command.prototype.upsertIssues.restore();
      Assurance.prototype.getStartAndEndInMonth.restore();
      assert.equal(result.data, null);
    });
    it('should return success get available date', async () => {
      const availableDate = {
        'data': {
          'data': [
            {
              'dateTime': '01-12-2020 08:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_0',
              'timeSlot': {
                'slotId': 'early-morning',
                'slot': '8:00 - 10:00',
                'time': '08:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'early-morning'
            },
            {
              'dateTime': '01-12-2020 10:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_2',
              'timeSlot': {
                'slotId': 'morning',
                'slot': '10:00 - 12:00',
                'time': '10:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'morning'
            },
            {
              'dateTime': '01-12-2020 13:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_4',
              'timeSlot': {
                'slotId': 'noon',
                'slot': '13:00 - 15:00',
                'time': '13:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'noon'
            }
          ]
        }
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(Redis.prototype, 'getData').resolves(JSON.stringify(availableDate));
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await assurance.getScheduleAvailability(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      Redis.prototype.getData.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data.issueId, 'MYINX-15916671112341');
    });
  });

  describe('reopenTechnician', () => {
    const payload = {
      userId:'9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      lang:'id'
    };
    const userResult = {
      err: null,
      data: {
        userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        fullName: 'Farid Tri Wicaksono',
        mobileNumber: '085646006937',
        email: 'putrafarid93@gmail.com',
        role: 'user',
        isActive: true,
        deviceId: '',
      }
    };
    it('should return error didnt get jwt', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await assurance.reopenTechnician(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return Ticket not found', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.reopenTechnician(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return User doesn\'t have privilege', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.reopenTechnician(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'User doesn\'t have privilege to perform this action. Required an active package');
    });
    it('should return error upsertIssue', async () => {
      const availableDate = {
        data: [
          {
            'dateTime': '01-12-2020 08:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_0',
            'timeSlot': {
              'slotId': 'early-morning',
              'slot': '8:00 - 10:00',
              'time': '08:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'early-morning'
          },
          {
            'dateTime': '01-12-2020 10:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_2',
            'timeSlot': {
              'slotId': 'morning',
              'slot': '10:00 - 12:00',
              'time': '10:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'morning'
          },
          {
            'dateTime': '01-12-2020 13:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_4',
            'timeSlot': {
              'slotId': 'noon',
              'slot': '13:00 - 15:00',
              'time': '13:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'noon'
          }
        ]
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(Redis.prototype, 'getData').resolves(null);
      sinon.stub(Assurance.prototype, 'getStartAndEndInMonth').resolves(availableDate);
      sinon.stub(Redis.prototype, 'setDataEx');
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await assurance.reopenTechnician(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      Redis.prototype.getData.restore();
      Redis.prototype.setDataEx.restore();
      command.prototype.upsertIssues.restore();
      Assurance.prototype.getStartAndEndInMonth.restore();
      assert.equal(result.data, null);
    });
    it('should return success get available date', async () => {
      const availableDate = {
        'data': {
          'data': [
            {
              'dateTime': '01-12-2020 08:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_0',
              'timeSlot': {
                'slotId': 'early-morning',
                'slot': '8:00 - 10:00',
                'time': '08:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'early-morning'
            },
            {
              'dateTime': '01-12-2020 10:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_2',
              'timeSlot': {
                'slotId': 'morning',
                'slot': '10:00 - 12:00',
                'time': '10:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'morning'
            },
            {
              'dateTime': '01-12-2020 13:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_4',
              'timeSlot': {
                'slotId': 'noon',
                'slot': '13:00 - 15:00',
                'time': '13:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'noon'
            }
          ]
        }
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(Redis.prototype, 'getData').resolves(JSON.stringify(availableDate));
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await assurance.reopenTechnician(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      Redis.prototype.getData.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data.issueId, 'MYINX-15916671112341');
    });
  });

  describe('getTicketDetails', () => {
    const payload = {
      userId:'9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      issueId: 'MYINX-15916671112341',
      lang:'id'
    };
    it('should return error didnt get jwt', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await assurance.getTicketDetails(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return Ticket not found', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.getTicketDetails(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return User doesn\'t have privilege', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.getTicketDetails(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'User doesn\'t have privilege to perform this action. Required an active package');
    });
    it('should return getDetailTeknisi Internal Server Error', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves({err:true});
      const result = await assurance.getTicketDetails(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return getDetailTeknisi Technician not found', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves({statusCode:'-2'});
      const result = await assurance.getTicketDetails(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Technician not found');
    });
    it('should return upsertIssues success', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves(technicianResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await assurance.getTicketDetails(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data.issueId, 'MYINX-15916671112341');
    });
    it('should return upsertIssues Internal server error', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves(technicianResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await assurance.getTicketDetails(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
  });

  describe('rescheduleTicket', () => {
    const payload = {
      userId:'9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      issueId: 'MYINX-15916671112341',
      lang:'id'
    };
    const userResult = {
      err: null,
      data: {
        userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        fullName: 'Farid Tri Wicaksono',
        mobileNumber: '085646006937',
        email: 'putrafarid93@gmail.com',
        role: 'user',
        isActive: true,
        deviceId: '',
      }
    };
    it('should return error didnt get jwt', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await assurance.rescheduleTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return Ticket not found', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.rescheduleTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return User doesn\'t have privilege', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.rescheduleTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'User doesn\'t have privilege to perform this action. Required an active package');
    });
    it('should return Waiting for ticketID', async () => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResults);
      sinon.stub(query.prototype, 'findAssurance').resolves({err:true});
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      const result = await assurance.rescheduleTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'Waiting for ticketID');
    });
    it('should return success get available date', async () => {
      const availableDate = {
        data: [
          {
            'dateTime': '01-12-2020 08:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_0',
            'timeSlot': {
              'slotId': 'early-morning',
              'slot': '8:00 - 10:00',
              'time': '08:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'early-morning'
          },
          {
            'dateTime': '01-12-2020 10:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_2',
            'timeSlot': {
              'slotId': 'morning',
              'slot': '10:00 - 12:00',
              'time': '10:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'morning'
          },
          {
            'dateTime': '01-12-2020 13:00',
            'availability': 1,
            'crewId': 'CREWMIHX',
            'information': '',
            'bookingId': '1606371797368_4',
            'timeSlot': {
              'slotId': 'noon',
              'slot': '13:00 - 15:00',
              'time': '13:00',
              'date': '2020-12-01'
            },
            'date': '2020-12-01',
            'slotId': 'noon'
          }
        ]
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(Redis.prototype, 'getData').resolves(null);
      sinon.stub(Assurance.prototype, 'getStartAndEndInMonth').resolves(availableDate);
      sinon.stub(Redis.prototype, 'setDataEx');
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await assurance.rescheduleTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      Redis.prototype.getData.restore();
      Redis.prototype.setDataEx.restore();
      command.prototype.upsertIssues.restore();
      Assurance.prototype.getStartAndEndInMonth.restore();
      assert.equal(result.data.issueId, 'MYINX-15916671112341');
    });
    it('should return success get available date', async () => {
      const availableDate = {
        'data': {
          'data': [
            {
              'dateTime': '01-12-2020 08:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_0',
              'timeSlot': {
                'slotId': 'early-morning',
                'slot': '8:00 - 10:00',
                'time': '08:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'early-morning'
            },
            {
              'dateTime': '01-12-2020 10:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_2',
              'timeSlot': {
                'slotId': 'morning',
                'slot': '10:00 - 12:00',
                'time': '10:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'morning'
            },
            {
              'dateTime': '01-12-2020 13:00',
              'availability': 1,
              'crewId': 'CREWMIHX',
              'information': '',
              'bookingId': '1606371797368_4',
              'timeSlot': {
                'slotId': 'noon',
                'slot': '13:00 - 15:00',
                'time': '13:00',
                'date': '2020-12-01'
              },
              'date': '2020-12-01',
              'slotId': 'noon'
            }
          ]
        }
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(Redis.prototype, 'getData').resolves(JSON.stringify(availableDate));
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await assurance.rescheduleTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      query.prototype.findAssurance.restore();
      query.prototype.findOneUser.restore();
      Redis.prototype.getData.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data.issueId, 'MYINX-15916671112341');
    });
  });

  describe('getStartAndEndInMonth', () => {
    const availableDate = [
      [
        {
          dateTime: '10-12-2020 09:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423764_1',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-10',
          slotId: 'early-morning'
        },
        {
          dateTime: '10-12-2020 10:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423764_2',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-10',
          slotId: 'morning'
        },
        {
          dateTime: '10-12-2020 13:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423764_4',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-10',
          slotId: 'noon'
        },
        {
          dateTime: '10-12-2020 15:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423764_6',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-10',
          slotId: 'evening'
        }
      ],
      [
        {
          dateTime: '11-12-2020 08:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423803_0',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-11',
          slotId: 'early-morning'
        },
        {
          dateTime: '11-12-2020 10:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423803_2',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-11',
          slotId: 'morning'
        },
        {
          dateTime: '11-12-2020 13:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423803_4',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-11',
          slotId: 'noon'
        },
        {
          dateTime: '11-12-2020 15:00',
          availability: 1,
          crewId: 'CREWMIHX',
          information: '',
          bookingId: '1606377423803_6',
          timeSlot: {
            slotId: 'noon',
            slot: '13:00 - 15:00',
            time: '13:00',
            date: '2020-12-01'
          },
          date: '2020-12-11',
          slotId: 'evening'
        }
      ]
    ];
    it('should return getServiceTechnicianPsbParallel', async () => {
      let payload = {
        sto:'BIN',
        jwt: responseJwt,
        psb: {crewId:'CREWMIHX',diffDays:6}
      };
      sinon.stub(service, 'getServiceTechnicianPsbParallel').resolves(availableDate);
      const result = await assurance.getStartAndEndInMonth(payload);
      service.getServiceTechnicianPsbParallel.restore();
      assert.equal(result.err, null);
    });

    it('should return getServiceTimesParallel', async () => {
      let payload = {
        sto:'BIN',
        jwt: responseJwt,
        psb: {crewId:'CREWMIHX',diffDays:62}
      };
      sinon.stub(service, 'getServiceTimesParallel').resolves(availableDate);
      const result = await assurance.getStartAndEndInMonth(payload);
      service.getServiceTimesParallel.restore();
      assert.equal(result.err, null);
    });
  });
});
