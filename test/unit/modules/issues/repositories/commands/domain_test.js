const assert = require('assert');
const sinon = require('sinon');
const common = require('../../../../../../bin/modules/issues/utils/common');
const status = require('../../../../../../bin/modules/issues/utils/status');
const command = require('../../../../../../bin/modules/issues/repositories/commands/command');
const query = require('../../../../../../bin/modules/issues/repositories/queries/query');
const Issues = require('../../../../../../bin/modules/issues/repositories/commands/domain');
const logger = require('../../../../../../bin/helpers/utils/logger');
const commonUtil = require('../../../../../../bin/helpers/utils/common');
const service = require('../../../../../../bin/modules/issues/utils/service');
const Redis = require('../../../../../../bin/helpers/databases/redis/redis');

describe('Issues Commands Domain', () => {
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

  const issues = new Issues(db);

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
      'ticketType': 'Logic',
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

  let issueResultTwo = {
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
      'ticketType': 'Logic',
      'message': 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
      'status': 'close',
      'schedule':
        {
          'bookingId': '1592286844074_6',
          'scheduleAttempt': 2,
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

  let issueResultCompleted = {
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
      'work': 'COMPLETED',
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

  let issueResultCompletedLogic = {
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
      'ticketType': 'Logic',
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
      'work': 'COMPLETED',
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
    err: null,
    data: {
      symptomId:'b8f83073-092e-4473-ab47-a3df613907f5',
      type:'Internet',
      descriptionId:'Telepon, Internet dan IndiHome TV tidak dapat berfungsi',
      descriptionEn:'All services (phone, Internet and TV) are not working',
      technicalLanguage:'Tidak Bisa Browsing - 2P / 3P Mati Total',
      fiber:{
        classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
        classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
      },
      copper:{
        classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
        classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
      },
      createdAt:'2020-06-06T10:05:09.006Z',
      lastModified:'2020-06-06T10:05:09.006Z'
    }
  };
  describe('createTicketIssue', () => {
    let userResult = {
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
    it('should return error user not have active package', async() => {
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };

      sinon.stub(query.prototype, 'findManyAccount').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      assert.equal(result.data, null);
    });

    it('should return error user not found', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'active',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };

      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.data, null);
    });

    it('should return error getJWT', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        err: null,
        data: {
          reserveId: 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
          transactionId: 'MYIRX-15918963805530',
          userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
          installationAddress: {
            province: 'DI Yogyakarta',
            provinceId: 102,
            city: 'SLEMAN',
            cityId: '4-859I2T',
            district: 'BALECATUR GAMPING',
            districtId: '4-OYJAQWY',
            postalCode: '55295',
            street: 'Desa BALECATUR 4.1',
            streetId: '4-K43JWNFK',
            rtRw: '',
            description: 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
            latitude: '-6.262341423527151',
            longitude: '106.75710786134005'
          },
          status: 'PT1',
          installationStatus: 'reserved',
          device: {
            odpId: '',
            locId: 'ODP-BIN-FBX/20',
            isiskaEqpt: '',
            deviceId: '16679194',
            sto: 'BIN',
            system: 'NOSS'
          },
          reserve: {
            telephone: '02154520168',
            transaction: '39918595',
            ncli: '50078137',
            reservationPort: '39918594',
            internetNumber: '123456679846',
            reservationId: '39918596'
          },
          document: {
            documentId: '52af361a-d8a8-4414-848f-c05b3a99f447',
            image: 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
            idNumber: '497977997797',
            name: 'bssbsbsns',
            motherName: 'ajsjs akaksj',
            type: 'sim',
            dateOfBirth: '1970-01-01T00:00:00.000Z',
            selfieImage: 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
            signature: 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
          },
          statusDocument: 'verified',
          schedule: {
            bookingId: '1591896675577_1',
            scheduleAttempt: 0,
            timeBox: '2020-06-11T17:37:03.775Z',
            timeSlot: {
              partsOfDay: 'Morning',
              slot: '8:00 - 12:00',
              time: '08:00',
              date: '2020-07-03'
            },
            availability: '1',
            crewId: 'CREWMIHX',
            information: 'Crew pada STO terdekat',
            contactSecondary: {
              fullName: 'aji byu',
              mobileNumber: '085156937292'
            }
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };

      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findPSB.restore();
      commonUtil.getJwtLegacy.restore();
      assert.equal(result.data, null);
    });

    it('should return psb not found', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'active',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };

      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves({err:true});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findPSB.restore();
      commonUtil.getJwtLegacy.restore();
      assert.equal(result.data, null);
    });

    it('should return error checkInquiry', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      assert.equal(result.data, null);
    });

    it('should return error outstanding bill', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '0',
        returnMessage: 'Successfull in retireving the data',
        data: {
          amount: '867004'
        }
      });
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      assert.equal(result.data, null);
    });

    it('should return error find assurance', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      assert.equal(result.data, null);
    });

    it('should return error checkCableType', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      assert.equal(result.data, null);
    });

    it('should return error getIboosterInfo', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({data: {cableType:'Fiber'}});
      sinon.stub(service, 'getIboosterInfo').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      service.getIboosterInfo.restore();
      assert.equal(result.data, null);
    });

    it('should return error User already has existing ticket fisik', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({data: {cableType:'Fiber'}});
      sinon.stub(service, 'getIboosterInfo').resolves({statusCode:'-2'});
      sinon.stub(Issues.prototype, 'checkIboosterRange').resolves(false);
      sinon.stub(Issues.prototype, 'checkACSResetStatus').resolves(true);
      sinon.stub(Issues.prototype, 'getSpec').resolves('A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002');
      sinon.stub(Issues.prototype, 'checkCategoriesTicket').resolves('Fisik');
      sinon.stub(query.prototype, 'findIssue').resolves({err:null, data:{status:'open'}});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      service.getIboosterInfo.restore();
      Issues.prototype.checkIboosterRange.restore();
      Issues.prototype.checkACSResetStatus.restore();
      Issues.prototype.getSpec.restore();
      Issues.prototype.checkCategoriesTicket.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.data, null);
    });

    it('should return error User already has existing ticket Admin', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({data: {cableType:'Fiber'}});
      sinon.stub(service, 'getIboosterInfo').resolves({statusCode:'-2'});
      sinon.stub(Issues.prototype, 'checkIboosterRange').resolves(false);
      sinon.stub(Issues.prototype, 'checkACSResetStatus').resolves(true);
      sinon.stub(Issues.prototype, 'getSpec').resolves('A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002');
      sinon.stub(Issues.prototype, 'checkCategoriesTicket').resolves('Admin');
      sinon.stub(query.prototype, 'findIssue').resolves({err:null, data:{status:'open'}});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      service.getIboosterInfo.restore();
      Issues.prototype.checkIboosterRange.restore();
      Issues.prototype.checkACSResetStatus.restore();
      Issues.prototype.getSpec.restore();
      Issues.prototype.checkCategoriesTicket.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.data, null);
    });

    it('should return error modem reset', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({data: {cableType:'Fiber'}});
      sinon.stub(service, 'getIboosterInfo').resolves({statusCode:'-2'});
      sinon.stub(Issues.prototype, 'checkIboosterRange').resolves(true);
      sinon.stub(Issues.prototype, 'checkACSResetStatus').resolves(false);
      sinon.stub(Issues.prototype, 'getSpec').resolves('A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002');
      sinon.stub(Issues.prototype, 'checkCategoriesTicket').resolves('Logic');
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      service.getIboosterInfo.restore();
      Issues.prototype.checkIboosterRange.restore();
      Issues.prototype.checkACSResetStatus.restore();
      Issues.prototype.getSpec.restore();
      Issues.prototype.checkCategoriesTicket.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.data, null);
    });

    it('should return error reportIssue', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({data: {cableType:'Fiber'}});
      sinon.stub(service, 'getIboosterInfo').resolves({statusCode:'-2'});
      sinon.stub(Issues.prototype, 'checkIboosterRange').resolves(true);
      sinon.stub(Issues.prototype, 'checkACSResetStatus').resolves(true);
      sinon.stub(Issues.prototype, 'getSpec').resolves('A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002');
      sinon.stub(Issues.prototype, 'checkCategoriesTicket').resolves('Logic');
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(service, 'reportIssue').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      service.getIboosterInfo.restore();
      Issues.prototype.checkIboosterRange.restore();
      Issues.prototype.checkACSResetStatus.restore();
      Issues.prototype.getSpec.restore();
      Issues.prototype.checkCategoriesTicket.restore();
      query.prototype.findIssue.restore();
      service.reportIssue.restore();
      assert.equal(result.data, null);
    });

    it('should return error insertIssue', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({data: {cableType:'Fiber'}});
      sinon.stub(service, 'getIboosterInfo').resolves({statusCode:'-2'});
      sinon.stub(Issues.prototype, 'checkIboosterRange').resolves(true);
      sinon.stub(Issues.prototype, 'checkACSResetStatus').resolves(true);
      sinon.stub(Issues.prototype, 'getSpec').resolves('A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002');
      sinon.stub(Issues.prototype, 'checkCategoriesTicket').resolves('Logic');
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(service, 'reportIssue').resolves({err:null});
      sinon.stub(command.prototype, 'insertIssue').resolves({err:true});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      service.getIboosterInfo.restore();
      Issues.prototype.checkIboosterRange.restore();
      Issues.prototype.checkACSResetStatus.restore();
      Issues.prototype.getSpec.restore();
      Issues.prototype.checkCategoriesTicket.restore();
      query.prototype.findIssue.restore();
      service.reportIssue.restore();
      command.prototype.insertIssue.restore();
      assert.equal(result.data, null);
    });

    it('should return success create issue logic', async() => {
      let accountResult = {
        err: null,
        data: [{
          'indihomeNumber': '123456679846',
          'createdAt': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'lastModified': {
            '$date': '2020-10-14T08:25:40.430Z'
          },
          'locId': 'ODP-BIN-FBU/38',
          'ncli': '50078137',
          'phoneNumber': '',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-14T08:25:40.424Z'
              },
              'lastModified': {
                '$date': '2020-10-14T08:25:40.424Z'
              }
            }
          ]
        },{
          'indihomeNumber': '121302518798',
          'createdAt': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'lastModified': {
            '$date': '2020-10-16T08:45:47.651Z'
          },
          'locId': 'ODP-BIN-FBU/69 FBU/D03/69.01',
          'ncli': '50078808',
          'phoneNumber': '02154520168',
          'sto': 'BIN',
          'users': [
            {
              'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              'portfolioId': '',
              'status': 'inactive',
              'svmLevel': 1,
              'isPrimary': true,
              'isDeleted': false,
              'createdAt': {
                '$date': '2020-10-16T08:45:47.637Z'
              },
              'lastModified': {
                '$date': '2020-10-16T08:45:47.637Z'
              }
            }
          ]
        }]
      };
      let psbResult = {
        'reserveId': 'd1c8f579-3366-4ad6-b5c7-943072d2a11b',
        'transactionId': 'MYIRX-15918963805530',
        'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        'installationAddress': {
          'province': 'DI Yogyakarta',
          'provinceId': 102,
          'city': 'SLEMAN',
          'cityId': '4-859I2T',
          'district': 'BALECATUR GAMPING',
          'districtId': '4-OYJAQWY',
          'postalCode': '55295',
          'street': 'Desa BALECATUR 4.1',
          'streetId': '4-K43JWNFK',
          'rtRw': '',
          'description': 'Jl. Bintaro Puspita Raya Blok A No.9, RT.9/RW.2',
          'latitude': '-6.262341423527151',
          'longitude': '106.75710786134005'
        },
        'status': 'PT1',
        'installationStatus': 'reserved',
        'device': {
          'odpId': '',
          'locId': 'ODP-BIN-FBX/20',
          'isiskaEqpt': '',
          'deviceId': '16679194',
          'sto': 'BIN',
          'system': 'NOSS'
        },
        'reserve': {
          'telephone': '02154520168',
          'transaction': '39918595',
          'ncli': '50078137',
          'reservationPort': '39918594',
          'internetNumber': '123456679846',
          'reservationId': '39918596'
        },
        'document': {
          'documentId': '52af361a-d8a8-4414-848f-c05b3a99f447',
          'image': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/sim/99599019-2964-447a-a2e8-5536508c8f4b.jpeg',
          'idNumber': '497977997797',
          'name': 'bssbsbsns',
          'motherName': 'ajsjs akaksj',
          'type': 'sim',
          'dateOfBirth': '1970-01-01T00:00:00.000Z',
          'selfieImage': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/63f3f7ec-4a8d-43c2-af74-17e4614b81f8.jpeg',
          'signature': 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/601f72fd-b61e-43e3-b62d-1623eabcaa42.jpeg'
        },
        'statusDocument': 'verified',
        'schedule': {
          'bookingId': '1591896675577_1',
          'scheduleAttempt': 0,
          'timeBox': '2020-06-11T17:37:03.775Z',
          'timeSlot': {
            'partsOfDay': 'Morning',
            'slot': '8:00 - 12:00',
            'time': '08:00',
            'date': '2020-07-03'
          },
          'availability': '1',
          'crewId': 'CREWMIHX',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': {
            'fullName': 'aji byu',
            'mobileNumber': '085156937292'
          }
        }
      };
      let payload = {
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        issueId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
        message: '',
        type: 'INTERNET'
      };
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findPSB').resolves(psbResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(service, 'checkCableType').resolves({data: {cableType:'Fiber'}});
      sinon.stub(service, 'getIboosterInfo').resolves({statusCode:'-2'});
      sinon.stub(Issues.prototype, 'checkIboosterRange').resolves(true);
      sinon.stub(Issues.prototype, 'checkACSResetStatus').resolves(true);
      sinon.stub(Issues.prototype, 'getSpec').resolves('A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002');
      sinon.stub(Issues.prototype, 'checkCategoriesTicket').resolves('Logic');
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(service, 'reportIssue').resolves({err:null});
      sinon.stub(command.prototype, 'insertIssue').resolves({err:null});
      const result = await issues.createTicketIssue(payload);
      query.prototype.findManyAccount.restore();
      query.prototype.findOneUser.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      service.checkInquiry.restore();
      query.prototype.findAssurance.restore();
      service.checkCableType.restore();
      service.getIboosterInfo.restore();
      Issues.prototype.checkIboosterRange.restore();
      Issues.prototype.checkACSResetStatus.restore();
      Issues.prototype.getSpec.restore();
      Issues.prototype.checkCategoriesTicket.restore();
      query.prototype.findIssue.restore();
      service.reportIssue.restore();
      command.prototype.insertIssue.restore();
      assert.equal(result.err, null);
      assert.equal(result.data.userId, 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c');
    });

  });

  describe('Update Ticket Id', () => {
    let payload = {
      ticketId: 'TCK-110',
      transactionId: 'MYINX-15916671112341',
    };
    const responDetailTeknisi = {
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
    let issueResultFisik = {
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

    it('should return upsertIssues success', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves(responDetailTeknisi);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateTicketId(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data, null);
    });
    it('should return upsertIssues error Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves(responDetailTeknisi);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateTicketId(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return upsertIssues error Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      sinon.stub(service, 'getDetailTeknisi').resolves(responDetailTeknisi);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateTicketId(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return upsertIssues getDetailTeknisi Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultFisik);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves({err:true});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateTicketId(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return upsertIssues getDetailTeknisi err null', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultFisik);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves(responDetailTeknisi);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateTicketId(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data, null);
    });
    it('should return upsertIssues Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'getDetailTeknisi').resolves(responDetailTeknisi);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await issues.updateTicketId(payload);
      commonUtil.getJwtLegacy.restore();
      service.getDetailTeknisi.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
  });

  describe('Update Status Ticket', () => {
    let payload = {
      ticketId: 'TCK-110',
      transactionId: 'MYINX-15916671112341',
      status: 'Open'
    };
    it('should return error updateStatusTicket Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      const result = await issues.updateStatusTicket({
        ticketId: '',
        transactionId: 'MYINX-15916671112341',
        status: 'Open'
      });
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return error updateStatusTicket Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateStatusTicket(payload);
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return updateStatusTicket error Ticket already in ASSIGNED', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateStatusTicket({
        ticketId: 'TCK-110',
        transactionId: 'MYINX-15916671112341',
        status: 'ASSIGNED'
      });
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Ticket already in ASSIGNED');
    });
    it('should return updateStatusTicket RESOLVED', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateStatusTicket({
        ticketId: 'TCK-110',
        transactionId: 'MYINX-15916671112341',
        status: 'RESOLVED'
      });
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data, null);
    });
    it('should return updateStatusTicket IN_PROGRESS', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateStatusTicket({
        ticketId: 'TCK-110',
        transactionId: 'MYINX-15916671112341',
        status: 'IN_PROGRESS'
      });
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data, null);
    });
    it('should return updateStatusTicket COMPLETED', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateStatusTicket({
        ticketId: 'TCK-110',
        transactionId: 'MYINX-15916671112341',
        status: 'COMPLETED'
      });
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data, null);
    });
    it('should return updateStatusTicket OPEN', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.updateStatusTicket({
        ticketId: 'TCK-110',
        transactionId: 'MYINX-15916671112341',
        status: 'OPEN'
      });
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data, null);
    });
    it('should return updateStatusTicket Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: true});
      const result = await issues.updateStatusTicket({
        ticketId: 'TCK-110',
        transactionId: 'MYINX-15916671112341',
        status: 'COMPLETED'
      });
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
  });

  describe('Reopen Ticket', () => {
    let payload = {
      'userId': '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
      'transactionId': 'MYINX-15916671112341',
      'message': 'Internet slow'
    };
    it('should return Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({responseJwt});
      const result = await issues.reopenTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Ticket not found',);
    });
    it('should return getJwtLegacy Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultCompleted);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await issues.reopenTicket(payload);
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error',);
    });
    it('should return service setReopenTicket complete ticket Type but fisik Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultCompleted);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({responseJwt});
      sinon.stub(service, 'setReopenTicket').resolves({err:true});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.reopenTicket(payload);
      command.prototype.upsertIssues.restore();
      service.setReopenTicket.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Internal server error',);
    });
    it('should return service setReopenTicket complete but ticket Type not fisik Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultCompletedLogic);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({responseJwt});
      sinon.stub(service, 'setReopenTicket').resolves({err:true});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.reopenTicket(payload);
      command.prototype.upsertIssues.restore();
      service.setReopenTicket.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Internal server error',);
    });
    it('should return service setReopenTicket complete but ticket Type not fisik Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultCompletedLogic);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({responseJwt});
      sinon.stub(service, 'setReopenTicket').resolves({err:null});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await issues.reopenTicket(payload);
      command.prototype.upsertIssues.restore();
      service.setReopenTicket.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Internal server error',);
    });
    it('should return service setReopenTicket complete but ticket Type not fisik success', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultCompletedLogic);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({responseJwt});
      sinon.stub(service, 'setReopenTicket').resolves({err:null});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.reopenTicket(payload);
      command.prototype.upsertIssues.restore();
      service.setReopenTicket.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.data, null);
    });
    it('should return service setReopenTicket complete but ticket Type fisik success', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultCompleted);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({responseJwt});
      sinon.stub(service, 'setReopenTicket').resolves({err:null});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await issues.reopenTicket(payload);
      command.prototype.upsertIssues.restore();
      service.setReopenTicket.restore();
      commonUtil.getJwtLegacy.restore();
      query.prototype.findIssue.restore();
      assert.equal(result.data, null);
    });
  });

  describe('Check Ibooster Range', () => {
    it('should return Check Ibooster Range Logic', async () => {
      const data = {
        spec: {
          fiber: {
            classificationId3Spec: 'ABC1234'
          }
        },
        iBooster: {}
      };
      sinon.stub(query.prototype, 'findSymptom').resolves({data: {type: 'Logic'}});
      const result = await issues.checkIboosterRange(data);
      query.prototype.findSymptom.restore();
      assert.equal(result, false);
    });

    it('should return Check Ibooster Range Fisik', async () => {
      const data = {
        spec: {
          fiber: {
            classificationId3Spec: 'ABC1234'
          }
        },
        iBooster: {}
      };
      sinon.stub(query.prototype, 'findSymptom').resolves({data: {type: 'Fisik'}});
      const result = await issues.checkIboosterRange(data);
      query.prototype.findSymptom.restore();
      assert.equal(result, false);
    });
  });

  describe('Add Comment', () => {
    let payload = {
      issueId: 'MYINX-15916671112341',
      comment: 'Internet slow'
    };
    it('should return add comment error Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.addComment(payload);
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return error add comment Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: true});
      const result = await issues.addComment(payload);
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success add comment', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err: null});
      const result = await issues.addComment(payload);
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err, null);
    });
  });

  describe('postScheduleIssue', () => {
    let payload = {
      'userId': '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      'bookingId': '1596442348216_6',
      'schedule': {
        'slotId': 'evening',
        'slot': '15:00 - 17:00',
        'time': '15:00',
        'date': '04-08-2020'
      },
      'crewId': 'A2BIN010',
      'information': 'Crew pada STO terdekat',
      'contactSecondary': {
        'fullName': 'Jufri',
        'mobileNumber': '081511420701'
      }
    };
    let userResult = {
      'err': null,
      'data': {
        '_id': '5bac53b45ea76b1e9bd58e1c',
        'userId': '97ef3bd8-78fb-4630-bf1b-4742021d23a1',
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
    let issue = {
      err:null,
      data: {
        issueId: 'MYINX-15916671112341',
        assetNum: '50014277_131184115030_INTERNET',
        psbAccount: {
          indihomeNumber: '131184115030',
          ncli: '50014277',
          telephoneNumber: '02154520122',
          sto:'BOO',
          address:'Komp. TAMAN PAJAJARAN 000 ,KATULAMPA Kec.BOGOR TIMUR,BOGOR - 16144 ',
          installationDate:'2015-04-03',
          transactionId:'',
          crewId:'CREWMIHX'
        },
        userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        symptom: {
          symptomId: 'b8f83073-092e-4473-ab47-a3df613907f5',
          clasificationId: 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
          isFiber: 'Fiber',
          iBooster: {}
        },
        issueType: 'INTERNET',
        ticketType: 'Fisik',
        message: 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
        status: 'pending',
        schedule:{
          scheduleAttempt: 0,
          timeBox: '2020-11-26T07:57:04.364+00:00'
        },
        createdAt: '2020-11-26T10:41:55.617+00:00',
        lastModified: '2020-11-26T10:41:55.617+00:00'
      }
    };
    it('should return error Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      const result = await issues.postScheduleIssue(payload);
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return error User doesn\'t have privilege', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      const result = await issues.postScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'User doesn\'t have privilege to perform this action. Required an active package');
    });
    it('should return error symptom not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves({err:true});
      const result = await issues.postScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      assert.equal(result.err.message, 'symptom not found');
    });
    it('should return error getJwtLegacy Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await issues.postScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return error service reportIssue Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportIssue').resolves({err:true});
      const result = await issues.postScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportIssue.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return error upsertIssues Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportIssue').resolves({statusCode:'0'});
      sinon.stub(Redis.prototype, 'deleteKey');
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await issues.postScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportIssue.restore();
      Redis.prototype.deleteKey.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    /*it('should return success upsertIssues', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportIssue').resolves({statusCode:'0'});
      sinon.stub(Redis.prototype, 'deleteKey');
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      sinon.stub(common, 'sendAssuranceCardToKafka');
      const result = await issues.postScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportIssue.restore();
      Redis.prototype.deleteKey.restore();
      command.prototype.upsertIssues.restore();
      common.sendAssuranceCardToKafka.restore();
      assert.equal(result.err, null);
    });*/
  });

  describe('postReopenScheduleIssue', () => {
    let payload = {
      userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      bookingId: '1596442348216_6',
      schedule: {
        slotId: 'evening',
        slot: '15:00 - 17:00',
        time: '15:00',
        date: '04-08-2020'
      },
      crewId: 'A2BIN010',
      information: 'Crew pada STO terdekat',
      contactSecondary: {
        fullName: 'Jufri',
        mobileNumber: '081511420701'
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
    let issue = {
      err:null,
      data: {
        issueId: 'MYINX-15916671112341',
        assetNum: '50014277_131184115030_INTERNET',
        psbAccount: {
          indihomeNumber: '131184115030',
          ncli: '50014277',
          telephoneNumber: '02154520122',
          sto:'BOO',
          address:'Komp. TAMAN PAJAJARAN 000 ,KATULAMPA Kec.BOGOR TIMUR,BOGOR - 16144 ',
          installationDate:'2015-04-03',
          transactionId:'',
          crewId:'CREWMIHX'
        },
        userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
        symptom: {
          symptomId: 'b8f83073-092e-4473-ab47-a3df613907f5',
          clasificationId: 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
          isFiber: 'Fiber',
          iBooster: {}
        },
        issueType: 'INTERNET',
        ticketType: 'Fisik',
        message: 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
        status: 'pending',
        schedule:{
          scheduleAttempt: 0,
          timeBox: '2020-11-26T07:57:04.364+00:00'
        },
        createdAt: '2020-11-26T10:41:55.617+00:00',
        lastModified: '2020-11-26T10:41:55.617+00:00'
      }
    };
    it('should return error Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      const result = await issues.postReopenScheduleIssue(payload);
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return error User doesn\'t have privilege', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      const result = await issues.postReopenScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      assert.equal(result.err.message, 'User doesn\'t have privilege to perform this action. Required an active package');
    });
    it('should return error symptom not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves({err:true});
      const result = await issues.postReopenScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      assert.equal(result.err.message, 'symptom not found');
    });
    it('should return error getJwtLegacy Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await issues.postReopenScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return error service reportIssue Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportReopenIssue').resolves({err:true});
      const result = await issues.postReopenScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportReopenIssue.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return error upsertIssues Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportReopenIssue').resolves({statusCode:'0'});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await issues.postReopenScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportReopenIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success upsertIssues', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(query.prototype, 'findOneUser').resolves(userResult);
      sinon.stub(query.prototype, 'findAssurance').resolves(assuranceResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportReopenIssue').resolves({statusCode:'0'});
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      sinon.stub(common, 'sendAssuranceCardToKafka');
      const result = await issues.postReopenScheduleIssue(payload);
      query.prototype.findIssue.restore();
      query.prototype.findOneUser.restore();
      query.prototype.findAssurance.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportReopenIssue.restore();
      command.prototype.upsertIssues.restore();
      common.sendAssuranceCardToKafka.restore();
      assert.equal(result.err, null);
    });
  });

  describe('rescheduleTicket', () => {
    let rescheduleTicketIssueResult = {
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
        'ticketType': 'Logic',
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
    let payload = {
      'userId': '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      'bookingId': '1596442348216_6',
      'schedule': {
        'slotId': 'evening',
        'slot': '15:00 - 17:00',
        'time': '15:00',
        'date': '04-08-2020'
      },
      'crewId': 'A2BIN010',
      'information': 'Crew pada STO terdekat',
      'contactSecondary': {
        'fullName': 'Jufri',
        'mobileNumber': '081511420701'
      }
    };
    it('should return error Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      const result = await issues.rescheduleTicket(payload);
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return error You have exceeded reschedule technician limit', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResultTwo);
      const result = await issues.rescheduleTicket(payload);
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'You have exceeded reschedule technician limit');
    });
    it('should return error getJwtLegacy Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(rescheduleTicketIssueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await issues.rescheduleTicket(payload);
      query.prototype.findIssue.restore();
      commonUtil.getJwtLegacy.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return error reportReopenIssue Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(rescheduleTicketIssueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportReopenIssue').resolves({err:true});
      const result = await issues.rescheduleTicket(payload);
      query.prototype.findIssue.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportReopenIssue.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return error reportReopenIssue upsertIssues Internal server error', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(rescheduleTicketIssueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportReopenIssue').resolves({
        transactionId: 'MYINX-202003021037',
        ticketID: 'IN53001617',
        bookingId: '1583120282095_0',
      });
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await issues.rescheduleTicket(payload);
      query.prototype.findIssue.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportReopenIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return error reportReopenIssue upsertIssues success', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(rescheduleTicketIssueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportReopenIssue').resolves({
        transactionId: 'MYINX-202003021037',
        ticketID: 'IN53001617',
        bookingId: '1583120282095_0',
      });
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await issues.rescheduleTicket(payload);
      query.prototype.findIssue.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportReopenIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.data.issueId, 'MYINX-15916671112341');
    });
    it('should return error upsertIssues Waiting for ticketID', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves(issueResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'reportReopenIssue').resolves({
        transactionId: 'MYINX-202003021037',
        ticketID: 'IN53001617',
        bookingId: '1583120282095_0',
      });
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await issues.rescheduleTicket(payload);
      query.prototype.findIssue.restore();
      commonUtil.getJwtLegacy.restore();
      service.reportReopenIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Waiting for ticketID');
    });
  });

  describe('closeTicket', () => {
    let payload = {
      'userId': 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
      'transactionId': 'MYIRX-1234567890000101'
    };
    it('should return closeTicket Ticket not found', async() => {
      sinon.stub(query.prototype, 'findIssue').resolves({err:true});
      const result = await issues.closeTicket(payload);
      query.prototype.findIssue.restore();
      assert.equal(result.err.message, 'Ticket not found');
    });
    it('should return closeTicket Ticket still in progress, wait until completed', async() => {
      let issue = {
        err: null,
        data: {
          issueId: 'MYINX-15916671112341',
          assetNum: '50014277_131184115030_INTERNET',
          psbAccount: {
            indihomeNumber: '131184115030',
            ncli: '50014277',
            telephoneNumber: '02154520122',
            sto:'BOO',
            address:'Komp. TAMAN PAJAJARAN 000 ,KATULAMPA Kec.BOGOR TIMUR,BOGOR - 16144 ',
            installationDate:'2015-04-03',
            transactionId:'',
            crewId:'CREWMIHX'
          },
          userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
          symptom:{
            symptomId: 'b8f83073-092e-4473-ab47-a3df613907f5',
            clasificationId: 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
            isFiber: 'Fiber',
            iBooster: {}
          },
          issueType: 'INTERNET',
          ticketType: 'Logic',
          message: 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
          status: 'open',
          schedule: {
            bookingId: '1592286844074_6',
            scheduleAttempt: 0,
            timeBox: '2020-09-11T02:33:31.078+00:00',
            timeSlot: {},
            availability: 1,
            crewId: 'A2BIN010',
            information: 'Crew pada STO terdekat',
            contactSecondary: null
          },
          createdAt: '2020-06-16T05:48:54.982Z',
          lastModified: '2020-06-16T05:55:09.963Z',
          work: 'IN_PROGRESS',
          ticketId: 'IN123456',
          technician: {
            personId:'TAW2JAKSEL_103',
            displayName:'JUFRIYANTO',
            email:'jufryanto@gmail.com',
            phone:'081285399618'
          }
        }
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await issues.closeTicket(payload);
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Ticket still in progress, wait until completed');
    });
    it('should return closeTicket Internal server error', async() => {
      let issue = {
        err: null,
        data: {
          issueId: 'MYINX-15916671112341',
          assetNum: '50014277_131184115030_INTERNET',
          psbAccount: {
            indihomeNumber: '131184115030',
            ncli: '50014277',
            telephoneNumber: '02154520122',
            sto:'BOO',
            address:'Komp. TAMAN PAJAJARAN 000 ,KATULAMPA Kec.BOGOR TIMUR,BOGOR - 16144 ',
            installationDate:'2015-04-03',
            transactionId:'',
            crewId:'CREWMIHX'
          },
          userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
          symptom:{
            symptomId: 'b8f83073-092e-4473-ab47-a3df613907f5',
            clasificationId: 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
            isFiber: 'Fiber',
            iBooster: {}
          },
          issueType: 'INTERNET',
          ticketType: 'Logic',
          message: 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
          status: 'open',
          schedule: {
            bookingId: '1592286844074_6',
            scheduleAttempt: 0,
            timeBox: '2020-09-11T02:33:31.078+00:00',
            timeSlot: {},
            availability: 1,
            crewId: 'A2BIN010',
            information: 'Crew pada STO terdekat',
            contactSecondary: null
          },
          createdAt: '2020-06-16T05:48:54.982Z',
          lastModified: '2020-06-16T05:55:09.963Z',
          work: 'COMPLETED',
          ticketId: 'IN123456',
          technician: {
            personId:'TAW2JAKSEL_103',
            displayName:'JUFRIYANTO',
            email:'jufryanto@gmail.com',
            phone:'081285399618'
          }
        }
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:true});
      const result = await issues.closeTicket(payload);
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success', async() => {
      let issue = {
        err: null,
        data: {
          issueId: 'MYINX-15916671112341',
          assetNum: '50014277_131184115030_INTERNET',
          psbAccount: {
            indihomeNumber: '131184115030',
            ncli: '50014277',
            telephoneNumber: '02154520122',
            sto:'BOO',
            address:'Komp. TAMAN PAJAJARAN 000 ,KATULAMPA Kec.BOGOR TIMUR,BOGOR - 16144 ',
            installationDate:'2015-04-03',
            transactionId:'',
            crewId:'CREWMIHX'
          },
          userId: '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
          symptom:{
            symptomId: 'b8f83073-092e-4473-ab47-a3df613907f5',
            clasificationId: 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
            isFiber: 'Fiber',
            iBooster: {}
          },
          issueType: 'INTERNET',
          ticketType: 'Logic',
          message: 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
          status: 'open',
          schedule: {
            bookingId: '1592286844074_6',
            scheduleAttempt: 0,
            timeBox: '2020-09-11T02:33:31.078+00:00',
            timeSlot: {},
            availability: 1,
            crewId: 'A2BIN010',
            information: 'Crew pada STO terdekat',
            contactSecondary: null
          },
          createdAt: '2020-06-16T05:48:54.982Z',
          lastModified: '2020-06-16T05:55:09.963Z',
          work: 'COMPLETED',
          ticketId: 'IN123456',
          technician: {
            personId:'TAW2JAKSEL_103',
            displayName:'JUFRIYANTO',
            email:'jufryanto@gmail.com',
            phone:'081285399618'
          }
        }
      };
      sinon.stub(query.prototype, 'findIssue').resolves(issue);
      sinon.stub(command.prototype, 'upsertIssues').resolves({err:null});
      const result = await issues.closeTicket(payload);
      query.prototype.findIssue.restore();
      command.prototype.upsertIssues.restore();
      assert.equal(result.err, null);
    });
  });

  describe('checkIboosterRange', () => {
    let payload = {
      iBooster:{
        onu_rx_pwr: -14
      }
    };
    it('should return IBooster in range', async() => {
      const result = await issues.checkIboosterRange(payload);
      assert.equal(result, true);
    });
  });

  describe('checkCategoriesTicket', () => {
    it('should return Admin', async() => {
      sinon.stub(status, 'categories').resolves('Admin');
      const result = await issues.checkCategoriesTicket({type:'Admin'});
      status.categories.restore();
      assert.equal(result, 'Admin');
    });

    it('should return Logic', async() => {
      const result = await issues.checkCategoriesTicket({iBoosterInSpec:true});
      assert.equal(result, 'Logic');
    });

    it('should return Fisik', async() => {
      const result = await issues.checkCategoriesTicket({iBoosterInSpec:false});
      assert.equal(result, 'Fisik');
    });
  });

  describe('checkACSResetStatus', () => {
    let payload = '123456789';
    it('should return error findOneModem', async() => {
      sinon.stub(query.prototype, 'findOneModem').resolves({err:true});
      const result = await issues.checkACSResetStatus(payload);
      query.prototype.findOneModem.restore();
      assert.equal(result, true);
    });

    it('should return found findOneModem', async() => {
      sinon.stub(query.prototype, 'findOneModem').resolves({err:null, data:{rebootTime:'2020-10-16T13:43:31.524+00:00'}});
      const result = await issues.checkACSResetStatus(payload);
      query.prototype.findOneModem.restore();
      assert.equal(result, true);
    });

    it('should return found findOneModem', async() => {
      sinon.stub(query.prototype, 'findOneModem').resolves({err:null, data:{rebootTime:'2021-11-27T13:43:31.524+00:00'}});
      const result = await issues.checkACSResetStatus(payload);
      query.prototype.findOneModem.restore();
      assert.equal(result, false);
    });
  });

  describe('getSpec', () => {
    it('should return category VOICE', async() => {
      let payload = {
        type: 'VOICE',
        iBoosterInSpec:true,
        fiber:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        copper:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
      };
      const result = await issues.getSpec(payload);
      assert.equal(result, payload.copper.classificationId3Spec);
    });

    it('should return category VOICE', async() => {
      let payload = {
        type: 'VOICE',
        iBoosterInSpec:false,
        fiber:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        copper:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
      };
      const result = await issues.getSpec(payload);
      assert.equal(result, payload.copper.classificationId3UnderSpec);
    });

    it('should return category Fiber', async() => {
      let payload = {
        isFiber: 'Fiber',
        iBoosterInSpec:true,
        fiber:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        copper:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
      };
      const result = await issues.getSpec(payload);
      assert.equal(result, payload.fiber.classificationId3Spec);
    });

    it('should return category Fiber', async() => {
      let payload = {
        isFiber: 'Copper',
        iBoosterInSpec:true,
        fiber:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        copper:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
      };
      const result = await issues.getSpec(payload);
      assert.equal(result, payload.copper.classificationId3Spec);
    });

    it('should return category Fiber', async() => {
      let payload = {
        isFiber: 'Fiber',
        iBoosterInSpec:false,
        fiber:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        copper:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
      };
      const result = await issues.getSpec(payload);
      assert.equal(result, payload.fiber.classificationId3UnderSpec);
    });

    it('should return category Copper', async() => {
      let payload = {
        isFiber: 'Copper',
        iBoosterInSpec:false,
        fiber:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
        copper:{
          classificationId3Spec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002',
          classificationId3UnderSpec:'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_001 //// A_INTERNET_001_001_002'
        },
      };
      const result = await issues.getSpec(payload);
      assert.equal(result, payload.copper.classificationId3UnderSpec);
    });
  });
});
