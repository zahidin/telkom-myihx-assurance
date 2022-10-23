const sinon = require('sinon');
const assert = require('assert');
const { expect } = require('chai');
const { BadRequestError } = require('../../../../../../bin/helpers/error');
const Faq = require('../../../../../../bin/modules/faq/repositories/queries/domain');
const query = require('../../../../../../bin/modules/faq/repositories/queries/query');
const queryUser = require('../../../../../../bin/modules/user/repositories/queries/query');
const serviceUtils = require('../../../../../../bin/modules/faq/utils/service');
const logger = require('../../../../../../bin/helpers/utils/logger');
const common = require('../../../../../../bin/helpers/utils/common');

describe('Domain query : FAQ', () => {
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

  const faq = new Faq(db);

  let questionResult = {
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
        'lastModified': '2020-09-15T13:55:02.609Z',
        'most': []
      }
    ]
  };
  let mostpopulerResult = {
    'err': null,
    'data': [{
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'questionId': '50b22beb-bb34-457f-99d0-7033573b2bc8',
      'subCategory': 'Troubleshooting',
      'count': 1,
      'most': [ [Object] ]
    },{
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'questionId': 'f2e47caa-99a3-4890-8b5e-d5429b656223',
      'subCategory': 'Troubleshooting',
      'count': 1,
      'most': [ [Object] ]
    }]
  };
  let questionOneResult = {
    'err': null,
    'data':
    {
      '_id': '5efedd00e67fb170dcf9336a',
      'questionId': '6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
      'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
      'subCategory': 'Troubleshooting',
      'titleLangId': 'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
      'titleLangEn': 'All the services (phone, Internet and TV) are not working',
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
      'lastModified': '2020-07-03T04:08:27.349Z'
    }
  };
  let answerManyResult = {
    'err': null,
    'data': [
      {
        '_id': '5f60c7b6832a33396c3c82b8',
        'answerId': '5f3f664b-4c34-8992-b629-0341769c3178',
        'keywords': '-',
        'descriptionLangId': '<h3>Layanan mungkin di non-aktifkan untuk sementara waktu<h3>.',
        'descriptionLangEn': '<h3>Service may be temporarily deactivated</h3>.',
        'createdAt': '2020-09-15T13:55:02.609Z',
        'lastModified': '2020-09-15T13:55:02.609Z'
      },
      {
        '_id': '5f60c7b6832a33396c32b8c8',
        'answerId': 'c4e96887-e40e-4404-af5d-90218645959e',
        'keywords': '-',
        'descriptionLangId': '<h3>Layanan mungkin di non-aktifkan untuk sementara waktu<h3>.',
        'descriptionLangEn': '<h3>Service may be temporarily deactivated</h3>.',
        'createdAt': '2020-09-15T13:55:02.609Z',
        'lastModified': '2020-09-15T13:55:02.609Z'
      }
    ]
  };
  let topicManyResult = {
    'err': null,
    'data': [
      {
        'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
        'categoryId': 'Internet',
        'categoryEn': 'Internet',
        'description': {
          'id': 'description indonesia',
          'en': 'description english'
        },
        'imageMobile': {
          'icon': 'topic/mobile/icon/998e84ca-0ef3-4ce9-8bd2-e47bf9511285.png',
          'background': 'topic/mobile/background/6e0ac609-7530-4562-babe-a83b33e4d365.png'
        },
        'imageWebsite': {
          'icon': 'topic/website/icon/d5750373-b036-4ec9-a114-aa7daf4906a6.png',
          'background': 'topic/website/background/9ac0648c-019e-40cb-ba4f-4e6291f9585e.png'
        },
        'publishDate': '2020-12-27',
        'status': 'active',
        'position': 1,
        'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'creatorName': 'Super Administrator',
        'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'updatedName': 'Super Administrator',
        'createdAt': '2020-12-27T08:10:58.248Z',
        'lastModified': '2021-01-25T03:53:53.570Z'
      },
      {
        'topicId': '5f3f664b-8992-4c34-b629-034176934578',
        'categoryId': 'Installation',
        'categoryEn': 'Installation',
        'description': {
          'id': 'description indonesia',
          'en': 'description english'
        },
        'imageMobile': {
          'icon': 'topic/mobile/icon/998e84ca-0ef3-4ce9-8bd2-e47bf9511285.png',
          'background': 'topic/mobile/background/6e0ac609-7530-4562-babe-a83b33e4d365.png'
        },
        'imageWebsite': {
          'icon': 'topic/website/icon/d5750373-b036-4ec9-a114-aa7daf4906a6.png',
          'background': 'topic/website/background/9ac0648c-019e-40cb-ba4f-4e6291f9585e.png'
        },
        'publishDate': '2020-12-27',
        'status': 'active',
        'position': 0,
        'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'creatorName': 'Super Administrator',
        'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'updatedName': 'Super Administrator',
        'createdAt': '2020-12-27T08:10:58.248Z',
        'lastModified': '2021-01-25T03:53:53.570Z'
      }
    ]
  };

  describe('Get Topic FAQ', () => {
    it('should return get All Topic Faq', async() => {
      sinon.stub(query.prototype, 'findManySort').resolves(topicManyResult);
      sinon.stub(query.prototype, 'findAggregate').resolves(mostpopulerResult);
      const result = await faq.getFaq('id');
      query.prototype.findManySort.restore();
      query.prototype.findAggregate.restore();
      assert.equal(result.data.topic[0].topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
    });
  });

  describe('Get List Topic FAQ', () => {
    const payload = {
      row: 1,
      page: 0,
      param: {
        'category': {
          '$in': ['TV','Internet']
        },
        'status': {
          '$in': ['active','inactive']
        }
      }
    };
    it('should return get List Topic Faq', async() => {
      sinon.stub(query.prototype, 'findAllTopic').resolves(topicManyResult);
      sinon.stub(query.prototype, 'countOnboarding').resolves({err: null});
      const result = await faq.listTopicFaq(payload);
      query.prototype.findAllTopic.restore();
      query.prototype.countOnboarding.restore();
      assert.equal(result.data[0].topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
    });
  });

  describe('Get FAQ Question', () => {
    it('should return error FAQ question by id topic not found', async() => {
      sinon.stub(query.prototype, 'find').resolves({err:true});
      const result = await faq.getFaqQuestion('5f3f664b-8992-4c34-b629-0341769c3178', 'id');
      query.prototype.find.restore();
      assert.equal(result.err.message, 'FAQ question by id topic not found');
    });
    it('should return get All Question Faq by Category', async() => {
      sinon.stub(query.prototype, 'find').resolves(questionResult);
      const result = await faq.getFaqQuestion('5f3f664b-8992-4c34-b629-0341769c3178', 'id');
      query.prototype.find.restore();
      assert.equal(result.data[0].topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
    });
  });

  describe('Get FAQ Question Detail', () => {
    it('should return error FAQ question by id question not found', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves({err:true});
      const result = await faq.getFaqQuestionDetail('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', 'id');
      query.prototype.findQuestionOne.restore();
      assert.equal(result.err.message, 'FAQ question by id question not found');
    });
    it('should return get All Question Detail', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(questionOneResult);
      sinon.stub(query.prototype, 'findAnswer').resolves(answerManyResult);
      const result = await faq.getFaqQuestionDetail('6460a229-3ce7-4c6a-bc2d-252e1f88ade3', 'id');
      query.prototype.findQuestionOne.restore();
      query.prototype.findAnswer.restore();
      assert.equal(result.data.length, 2);
      assert.equal(result.data[0].answerId, '5f3f664b-4c34-8992-b629-0341769c3178');
    });
  });

  describe('Get FAQ By Sub Category', () => {
    it('should return FAQ question not found', async() => {
      sinon.stub(query.prototype, 'find').resolves({err:true});
      const result = await faq.getFaqSubCategory({topicId:'5f3f664b-8992-4c34-b629-0341769c3178',subCategory:'Troubleshooting'}, 'id');
      query.prototype.find.restore();
      assert.equal(result.err.message, 'FAQ question not found');
    });
    it('should return FAQ question not found', async() => {
      sinon.stub(query.prototype, 'find').resolves(questionResult);
      sinon.stub(query.prototype, 'findAnswer').resolves(answerManyResult);
      const result = await faq.getFaqSubCategory({topicId:'5f3f664b-8992-4c34-b629-0341769c3178',subCategory:'Troubleshooting'}, 'id');
      query.prototype.find.restore();
      query.prototype.findAnswer.restore();
      assert.equal(result.data.length, 2);
      assert.equal(result.data[0].answerId, '5f3f664b-4c34-8992-b629-0341769c3178');
    });
  });

  describe('checkGamasIssue', () => {
    let queryPSBResult = {
      err: null,
      data: {
        reserveId: '12345qwert567890',
        transactionId: 'MYIRX-1234567890000101',
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        installationStatus: 'reserved',
        installationAddress: {
          province: 'DKI Jakarta',
          provinceId: 103,
          city: 'JAKARTA SELATAN',
          cityId: '4-6W3BWT',
          district: 'BINTARO',
          districtId: '4-JTBVGI2',
          postalCode: '12330',
          street: 'BINTARO JAYA KASUARI BL HB1',
          streetId: '4-0WXTFYP9',
          rtRw: '008/009',
          description: 'BINTARO JAYA KASUARI BL HB1',
          latitude: '-6.262503',
          longitude: '106.7585933'
        },
        status: 'PT1',
        device: {
          odpId: '',
          locId: 'ODP-BIN-FBW/22',
          isiskaEqpt: '',
          deviceId: '16606849',
          sto: 'BIN',
          system: 'NOSS'
        },
        reserve: {
          telephone: '02122733415',
          transaction: '39914754',
          ncli: '08241891',
          reservationPort: '39914753',
          internetNumber: '122302222156',
          reservationId: '39914755'
        },
        schedule: {
          bookingId: '1591601923284_2',
          scheduleAttempt: 0,
          timeBox: '2020-06-08T08:09:28.429Z',
          timeSlot: {
            partsOfDay: 'Afternoon',
            slot: '12:00 - 17:00',
            time: '15:30',
            date: '2020-06-21'
          },
          availability: 1,
          crewId: 'CREWMIHX',
          information: 'Crew pada STO terdekat',
          work: 'COMPLETED',
          contactSecondary: {
            fullName: 'tes',
            mobileNumber: '085748723837'
          },
          infoWo: {
            siteId: 'REG-2',
            woNum: '7760784'
          },
          technician: {
            personId: '123456',
            displayName: 'Najmi',
            email: 'm.najmiardan@gmail.com',
            phone: '08128909313'
          }
        },
        document: {
          documentId: '45f6db4a-5818-49cd-a38f-2426bbd4d45b',
          image: 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/ektp/2c81f3e8-e9ef-4e0c-af30-1c94e93255c0.jpg',
          idNumber: '3275080405950010',
          name: 'farid',
          motherName: 'siti farid',
          type: 'ektp',
          dateOfBirth: '2019-11-01',
          createdAt: '1586408579555',
          lastModified: '1586408579555',
          selfieImage: 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/selfi/6c4a0c38-f7bc-458d-97a7-e3c29bbf17d8.jpg',
          signature: 'http://minio-myihx-dev-myihx-dev.vsan-apps.playcourt.id/signature/eb313e54-b988-4803-9fee-36081f4274f8.pdf'
        },
        createdAt: '2020-03-28T23:55:03.459+00:00',
        updatedAt: '2020-03-28T23:55:03.459+00:00'
      }
    };
    let pelangganResult = {
      'statusCode': '0',
      'returnMessage': 'Success',
      'data': {
        'ncli': '08241891',
        'nama': 'DTR1\\ GM WITEL RIKEP\\TEDDY H\\720128',
        'cKota': '4-S9YTS9',
        'kota': 'BOGOR',
        'cKecamatan': '4-0GSWO0U',
        'kecamatan': 'CIMAHPAR Kec.BOGOR UTARA',
        'cJalan': '4-55RTXFO0',
        'jalan': 'Komp. BUKIT BOGOR RAYA',
        'nomor': 'BL I 20/11',
        'cPos': '16155',
        'lgest': 'DCS - UCS II',
        'lprof': 'Karyawan TELKOM',
        'RT': '002',
        'RW': '014',
        'salutation': '.',
        'npwp': '0',
        'statusCode': '0',
        'statusText': 'Success',
        'custType': 'Retail',
        'custCat': 'Dinastel Rumah',
        'birthPlace': null,
        'birthDate': '01-JAN-00',
        'motherMaiden': 'MIG_MOTHER',
        'nationality': 'Indonesia',
        'gender': 'MIG_GENDER',
        'idExpiryDt': '08-OCT-99',
        'caID': '3-9DO-1724',
        'baNama': 'DTR1\\ GM WITEL RIKEP\\TEDDY H\\720128',
        'baCKota': '4-S9YTS9',
        'baKota': 'BOGOR',
        'baCKecamatan': '4-0GSWO0U',
        'baKecamatan': 'CIMAHPAR Kec.BOGOR UTARA',
        'baCJalan': '4-55RTXFO0',
        'baJalan': 'Komp. BUKIT BOGOR RAYA',
        'baNomor': 'BL I 20/11',
        'baCPos': '16155',
        'baLGEST': null,
        'baLPROF': null,
        'baRT': '002',
        'baRW': '014',
        'baSalutation': '.',
        'baNPWP': '0',
        'baBirthDate': null,
        'baBirthPlace': null,
        'baMotherMaiden': null,
        'baCustType': null,
        'baCustCat': null,
        'baNationality': null,
        'baGender': null,
        'baIDExpiryDt': null,
        'baID': '3-9F4-8673',
        'saNama': 'DTR1\\ GM WITEL RIKEP\\TEDDY H\\720128',
        'saCKota': '4-S9YTS9',
        'saKota': 'BOGOR',
        'saCKecamatan': '4-0GSWO0U',
        'saKecamatan': 'CIMAHPAR Kec.BOGOR UTARA',
        'saCJalan': '4-55RTXFO0',
        'saJalan': 'Komp. BUKIT BOGOR RAYA',
        'saNomor': 'BL I 20/11',
        'saCPos': '16155',
        'saLGEST': null,
        'saLPROF': null,
        'saRT': '002',
        'saRW': '014',
        'saSalutation': '.',
        'saNPWP': null,
        'saBirthDate': null,
        'saBirthPlace': null,
        'saMotherMaiden': null,
        'saCustType': null,
        'saCustCat': null,
        'saNationality': null,
        'saGender': null,
        'saIDExpiryDt': null,
        'saID': '3-9GF-1717',
        'saIndihomeIndicator': 'Indihome',
        'saWitel': 'BOGOR',
        'saSTOCD': 'BOO',
        'caStatus': 'Active',
        'baStatus': 'Active',
        'saStatus': 'Active',
        'caCountry': 'Indonesia',
        'baCountry': 'Indonesia',
        'saCountry': 'Indonesia',
        'saLonglitude': '106.8341131',
        'saLatitude': '-6.5871336',
        'saIndihome': null,
        'saEbisFlg': null,
        'IDType': 'KTP',
        'IDNumber': '1378989987650003',
        'CustomerContact': [
          {
            'jenis': 'AreaCode BA',
            'isi': '+62'
          },
          {
            'jenis': 'AreaCode CA',
            'isi': '+62'
          },
          {
            'jenis': 'Email',
            'isi': 'teddyhartadi@gmail.com'
          },
          {
            'jenis': 'Email BA',
            'isi': 'teddyhartadi@gmail.com'
          },
          {
            'jenis': 'MainPhoneNumber BA',
            'isi': '811359109'
          },
          {
            'jenis': 'MainPhoneNumber CA',
            'isi': '811359109'
          },
          {
            'jenis': 'TelpRumahAreaCodeBA',
            'isi': null
          },
          {
            'jenis': 'TelpRumahAreaCodeCA',
            'isi': null
          },
          {
            'jenis': 'TelpRumahBA',
            'isi': null
          },
          {
            'jenis': 'TelpRumahCA',
            'isi': '18338119'
          }
        ],
        'CustomerAsset': [
          {
            'nd': '122302222156',
            'ndRef': '02518338119',
            'ndType': 'Internet',
            'odpID': '258411924',
            'odpName': 'ODP-BOO-FFA/38 FFA/D01/38.01',
            'reason': null,
            'assetStatus': 'Active',
            'assetProvDT': '2012-11-26 00:00:00.0',
            'assetBillActiveDT': '2018-01-11 00:00:00.0',
            'assetResumeDT': null,
            'assetSuspendDT': null,
            'assetInactiveDT': null,
            'categoryCD': null,
            'prodID': '1-4BI8Z',
            'integrationID': '3-9H9-10891',
            'NDMaskNumber': null
          },
          {
            'nd': '02518338119',
            'ndRef': '122302222156',
            'ndType': 'Telephone',
            'odpID': '258411924',
            'odpName': 'ODP-BOO-FFA/38 FFA/D01/38.01',
            'reason': null,
            'assetStatus': 'Active',
            'assetProvDT': '2018-04-04 00:00:00.0',
            'assetBillActiveDT': '2018-01-11 00:00:00.0',
            'assetResumeDT': null,
            'assetSuspendDT': null,
            'assetInactiveDT': null,
            'categoryCD': null,
            'prodID': '1-1P97D',
            'integrationID': '3-9KB-2530',
            'NDMaskNumber': null
          }
        ],
        'DID': {
          'RangeDID': [
            {
              'rowNum': null,
              'NDAwal': null,
              'NDAkhir': null,
              'SAID': null,
              'xStatus': null,
              'startDT': null,
              'endDT': null
            }
          ]
        }
      }
    };
    let gamasResult = {
      'statusCode': '0',
      'returnMessage': 'Data ditemukan',
      'data': [
        {
          gamas: {
            statusDate: '2020-08-31 16:00:00'
          }
        }
      ],
    };
    let gamasIssue = {
      type: 'GAMAS',
      title: 'Saat ini daerah Anda sedang mengalami gangguan massal',
      description: 'Hal ini sedang dalam penanganan teknisi kami',
      message: 'Mohon maaf atas ketidaknyamannya'
    };

    const responseJwt = {
      data: 'eb457622b6fd2231e522befeebf0278f5d8875ebxxxx'
    };

    let payload = {
      indihomeNumber: '122302222156',
      lang: 'id'
    };

    it('should return error getJwtLegacy', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves({err:true});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      assert.equal(result.data, null);
    });

    it('should return error findPSB', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves({err:true});
      sinon.stub(serviceUtils, 'getPelanggan').resolves({err:true});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.getPelanggan.restore();
      assert.equal(result.data, null);
    });

    it('should return error getPelanggan', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves({err:true});
      sinon.stub(serviceUtils, 'getPelanggan').resolves({err:true});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.getPelanggan.restore();
      assert.equal(result.data, null);
    });

    it('should return error getPelanggan', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves({err:true});
      sinon.stub(serviceUtils, 'getPelanggan').resolves({statusCode :'-2'});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.getPelanggan.restore();
      assert.equal(result.data, null);
    });

    it('should return error gamas', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves({err:true});
      sinon.stub(serviceUtils, 'getPelanggan').resolves(pelangganResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({err:true});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.getPelanggan.restore();
      serviceUtils.checkGamas.restore();
      assert.equal(result.data, null);
    });

    it('should return success getPelanggan', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves({err:true});
      sinon.stub(serviceUtils, 'getPelanggan').resolves(pelangganResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves(gamasResult);
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.getPelanggan.restore();
      serviceUtils.checkGamas.restore();
      assert.equal(result.data.title, gamasIssue.title);
      assert.equal(result.data.type, gamasIssue.type);
    });

    it('should return success gamas', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves(gamasResult);
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      assert.equal(result.data.title, gamasIssue.title);
      assert.equal(result.data.type, gamasIssue.type);
    });

    it('should return success gamas', async() => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves(gamasResult);
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      assert.equal(result.data.title, gamasIssue.title);
      assert.equal(result.data.type, gamasIssue.type);
    });

    it('should handle check Isolir failed', async () => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({statusCode:'-2'});
      sinon.stub(serviceUtils, 'checkIsolir').resolves({err: {message: 'Check Isolir Error'}});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      expect(result).to.have.keys(['err', 'data']);
      expect(result.err).to.eql(new BadRequestError({
        code: 1004,
        message: 'Check Isolir Error'
      }));
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      serviceUtils.checkIsolir.restore();
    });

    it('should handle check Isolir success', async () => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({statusCode:'-2'});
      sinon.stub(serviceUtils, 'checkIsolir').resolves({err: null, checkNDResponse: {
        OutCheckND:{
          O_STATUS_CODE: 'F-1', O_STATUS_TEXT: 'Nomor sedang diisolir'
        }
      }});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      expect(result).to.have.keys(['err', 'data']);
      expect(result.data).to.have.keys(['indihomeNum', 'status', 'title', 'description']);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      serviceUtils.checkIsolir.restore();
    });

    it('should handle check Isolir success EN', async () => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({statusCode:'-2'});
      sinon.stub(serviceUtils, 'checkIsolir').resolves({err: null, checkNDResponse: {
        OutCheckND:{
          O_STATUS_CODE: 'F-1', O_STATUS_TEXT: 'Nomor sedang diisolir'
        }
      }});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,'en');
      expect(result).to.have.keys(['err', 'data']);
      expect(result.data).to.have.keys(['indihomeNum', 'status', 'title', 'description']);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      serviceUtils.checkIsolir.restore();
    });

    it('should handle check Inquiry failed', async () => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({statusCode:'-2'});
      sinon.stub(serviceUtils, 'checkIsolir').resolves({err: null, checkNDResponse: {
        OutCheckND:{
          O_STATUS_CODE: 'T', O_STATUS_TEXT: 'Success'
        }
      }});
      sinon.stub(serviceUtils, 'checkInquiry').resolves({err: {message : 'Check Inquiry Error'}});
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      expect(result).to.have.keys(['err', 'data']);
      expect(result.err).to.eql(new BadRequestError({
        code: 1005,
        message: 'Check Inquiry Error'
      }));
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      serviceUtils.checkIsolir.restore();
      serviceUtils.checkInquiry.restore();
    });

    it('should handle check Inquiry success', async () => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({statusCode:'-2'});
      sinon.stub(serviceUtils, 'checkIsolir').resolves({err: null, checkNDResponse: {
        OutCheckND:{
          O_STATUS_CODE: 'T', O_STATUS_TEXT: 'Success'
        }
      }});
      sinon.stub(serviceUtils, 'checkInquiry').resolves({err: null,
        statusCode: '0',
        returnMessage: 'Successfull in retireving the data',
        data: {
          amount: '867004'
        }
      });
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      expect(result).to.have.keys(['err', 'data']);
      expect(result.data).to.have.keys(['indihomeNum', 'status', 'title', 'description', 'amount']);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      serviceUtils.checkIsolir.restore();
      serviceUtils.checkInquiry.restore();
    });

    it('should handle check Inquiry success EN', async () => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({statusCode:'-2'});
      sinon.stub(serviceUtils, 'checkIsolir').resolves({err: null, checkNDResponse: {
        OutCheckND:{
          O_STATUS_CODE: 'T', O_STATUS_TEXT: 'Success'
        }
      }});
      sinon.stub(serviceUtils, 'checkInquiry').resolves({err: null,
        statusCode: '0',
        returnMessage: 'Successfull in retireving the data',
        data: {
          amount: '867004'
        }
      });
      const result = await faq.checkGamasIssue(payload.indihomeNumber,'en');
      expect(result).to.have.keys(['err', 'data']);
      expect(result.data).to.have.keys(['indihomeNum', 'status', 'title', 'description', 'amount']);
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      serviceUtils.checkIsolir.restore();
      serviceUtils.checkInquiry.restore();
    });

    it('should handle check Inquiry and Isolir failed', async () => {
      sinon.stub(common, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(query.prototype, 'findPSB').resolves(queryPSBResult);
      sinon.stub(serviceUtils, 'checkGamas').resolves({statusCode:'-2'});
      sinon.stub(serviceUtils, 'checkIsolir').resolves({err: null, checkNDResponse: {
        OutCheckND:{
          O_STATUS_CODE: 'T', O_STATUS_TEXT: 'Success'
        }
      }});
      sinon.stub(serviceUtils, 'checkInquiry').resolves({err: null,
        statusCode: '-2'
      });
      const result = await faq.checkGamasIssue(payload.indihomeNumber,payload.lang);
      expect(result).to.have.keys(['err', 'data']);
      expect(result.err).to.eql(new BadRequestError({
        code: 1006,
        message: 'CANNOT CHECK OUTSTANDING AND ISOLIR INDIHOME NUMBER'
      }));
      common.getJwtLegacy.restore();
      query.prototype.findPSB.restore();
      serviceUtils.checkGamas.restore();
      serviceUtils.checkIsolir.restore();
      serviceUtils.checkInquiry.restore();
    });
  });

  describe('getTroubleshooting', () => {
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
    let queryUserResult = {
      err: null,
      data: {
        _id: '5bac53b45ea76b1e9bd58e1c',
        userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
        fullName: 'Mas Farid',
        mobileNumber: '081289607540',
        email: 'farid.wicak@gmail.com',
        password: '$2a$10$D3jMWU9WbHzjY2VsZMOMrOT96tOnKi.uPV8D8DQNcwGcS3uSHZYCG',
        loginAttempt: 0,
        role: 'user',
        isActive: true,
        deviceId: '',
        accounts: [{
          indihomeNumber: '121105200720',
          status: 'inactive'
        }, {
          indihomeNumber: '122302222156',
          status: 'active'
        }],
        token: '',
        verifyForgotPassword: false,
        createdAt: '2020-03-09T02:51:15.229Z',
        lastModified: '2020-07-27T07:00:57.102Z',
        profilePicture: 'http://minio-palapaone-dev.vsan-apps.playcourt.id/palapaone/users/default_profile_picture.jpeg',
        forgotPasswordAttempt: 0,
        blockAccountDate: ''
      }
    };
    let queryTopicResult = {
      err: null,
      data: {
        _id: '5bac53b45ea76b1e9bd58e1c',
        topicId: '5f3f664b-8992-4c34-b629-0341769c3178',
        categoryId: 'Internet',
        categoryEn: 'Internet',
        icon: '',
        createdAt: '2020-03-09T02:51:15.229Z',
        lastModified: '2020-07-27T07:00:57.102Z'
      }
    };
    let gamasIssue = {
      err:null,
      data:{
        type: 'GAMAS',
        title: 'Saat ini daerah Anda sedang mengalami gangguan massal',
        description: 'Hal ini sedang dalam penanganan teknisi kami',
        message: 'Mohon maaf atas ketidaknyamannya'
      }
    };
    let queryAssuranceResult = {
      err:null,
      data: [
        {
          '_id': '5edd87a90c624c501c2126b9',
          'symptomId': '9e6b0c6e-81c0-46bf-acb1-4c8943a5e9dd',
          'type': 'TV',
          'descriptionId': 'Remote IndiHome TV tidak berfungsi',
          'descriptionEn': 'IndiHome TV Remote does not work',
          'technicalLanguage': 'Perangkat Pelanggan - Remote Rusak',
          'fiber': {
            'classificationId3Spec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002',
            'classificationId3UnderSpec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002'
          },
          'copper': {
            'classificationId3Spec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002',
            'classificationId3UnderSpec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002'
          },
          'createdAt': '2020-06-06T10:05:09.006Z',
          'lastModified': '2020-06-06T10:05:09.006Z',
          'score': 8.375
        },
        {
          '_id': '5edd87a90c624c501c2126b9',
          'symptomId': '9e6b0c6e-81c0-46bf-acb1-4c8943a5e9dd',
          'type': 'TV',
          'descriptionId': 'Remote IndiHome TV tidak berfungsi',
          'descriptionEn': 'IndiHome TV Remote does not work',
          'technicalLanguage': 'Perangkat Pelanggan - Remote Rusak',
          'fiber': {
            'classificationId3Spec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002',
            'classificationId3UnderSpec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002'
          },
          'copper': {
            'classificationId3Spec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002',
            'classificationId3UnderSpec': 'A_IPTV //// A_IPTV_001 //// A_IPTV_001_003 //// A_IPTV_001_003_002'
          },
          'createdAt': '2020-06-06T10:05:09.006Z',
          'lastModified': '2020-06-06T10:05:09.006Z',
          'score': 3.375
        }
      ]
    };

    let payload = {
      userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
      QuestionId: '6460a229-3ce7-4c6a-bc2d-252e1f88ade3'
    };

    it('should return error getTroubleshooting', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves({err:true});
      const result = await faq.getTroubleshooting(payload, 'id');
      query.prototype.findQuestionOne.restore();
      assert.equal(result.data, null);
    });

    it('should return error cannot find topic getTroubleshooting', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(questionOneResult);
      sinon.stub(query.prototype, 'findTopic').resolves({err:true});
      const result = await faq.getTroubleshooting(payload, 'id');
      query.prototype.findQuestionOne.restore();
      query.prototype.findTopic.restore();
      assert.equal(result.data, null);
    });

    it('should return error cannot user doesnt have active package, getTroubleshooting', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(questionOneResult);
      sinon.stub(query.prototype, 'findTopic').resolves(queryTopicResult);
      sinon.stub(query.prototype, 'findManyAccount').resolves({err:true});
      const result = await faq.getTroubleshooting(payload, 'id');
      query.prototype.findQuestionOne.restore();
      query.prototype.findTopic.restore();
      query.prototype.findManyAccount.restore();
      assert.equal(result.data, null);
    });

    it('should return error gamas issue getTroubleshooting', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(questionOneResult);
      sinon.stub(query.prototype, 'findTopic').resolves(queryTopicResult);
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(queryUser.prototype, 'findOneUser').resolves({err:true});
      sinon.stub(Faq.prototype, 'checkGamasIssue').resolves(gamasIssue);
      const result = await faq.getTroubleshooting(payload, 'id');
      query.prototype.findQuestionOne.restore();
      query.prototype.findTopic.restore();
      query.prototype.findManyAccount.restore();
      queryUser.prototype.findOneUser.restore();
      Faq.prototype.checkGamasIssue.restore();
      assert.equal(result.data, null);
    });

    it('should return error gamas issue getTroubleshooting', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(questionOneResult);
      sinon.stub(query.prototype, 'findTopic').resolves(queryTopicResult);
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(queryUser.prototype, 'findOneUser').resolves(queryUserResult);
      sinon.stub(Faq.prototype, 'checkGamasIssue').resolves(gamasIssue);
      const result = await faq.getTroubleshooting(payload, 'id');
      query.prototype.findQuestionOne.restore();
      query.prototype.findTopic.restore();
      query.prototype.findManyAccount.restore();
      queryUser.prototype.findOneUser.restore();
      Faq.prototype.checkGamasIssue.restore();
      assert.equal(result.data, null);
    });

    it('should return success getTroubleshooting', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(questionOneResult);
      sinon.stub(query.prototype, 'findTopic').resolves(queryTopicResult);
      sinon.stub(query.prototype, 'findManyAccount').resolves(accountResult);
      sinon.stub(queryUser.prototype, 'findOneUser').resolves(queryUserResult);
      sinon.stub(Faq.prototype, 'checkGamasIssue').resolves({err:true, data:null});
      sinon.stub(query.prototype, 'createIndex');
      sinon.stub(query.prototype, 'findAssuranceSort').resolves(queryAssuranceResult);
      const result = await faq.getTroubleshooting(payload);
      query.prototype.findQuestionOne.restore();
      query.prototype.findTopic.restore();
      query.prototype.findManyAccount.restore();
      queryUser.prototype.findOneUser.restore();
      Faq.prototype.checkGamasIssue.restore();
      query.prototype.createIndex.restore();
      query.prototype.findAssuranceSort.restore();
      assert.equal(result.err, null);
      assert.equal(result.data[0].symptomId, '9e6b0c6e-81c0-46bf-acb1-4c8943a5e9dd');
    });
  });

  describe('getTopicDetail', () => {
    const payload = {
      err: null,
      data: {
        'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
        'categoryId': 'Internet',
        'categoryEn': 'Internet',
        'description': {
          'id': '',
          'en': ''
        },
        'imageMobile': {
          'icon': 'topic/mobile/icon/998e84ca-0ef3-4ce9-8bd2-e47bf9511285.png',
          'background': 'topic/mobile/background/6e0ac609-7530-4562-babe-a83b33e4d365.png'
        },
        'imageWebsite': {
          'icon': 'topic/website/icon/d5750373-b036-4ec9-a114-aa7daf4906a6.png',
          'background': 'topic/website/background/9ac0648c-019e-40cb-ba4f-4e6291f9585e.png'
        },
        'publishDate': '2020-12-27',
        'status': 'active',
        'position': 1,
        'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'creatorName': 'Super Administrator',
        'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'updatedName': 'Super Administrator',
        'createdAt':'2020-12-27T08:10:58.248Z',
        'lastModified':'2021-01-25T03:53:53.570Z'
      }
    };
    it('should return error topic not found', async() => {
      sinon.stub(query.prototype, 'findTopicFaq').resolves({err: true});
      const result = await faq.getTopicDetail('5f3f664b-8992-4c34-b629-0341769c3178');
      query.prototype.findTopicFaq.restore();
      assert.equal(result.err.message, 'Topic not found');
    });
    it('should return should success', async() => {
      sinon.stub(query.prototype, 'findTopicFaq').resolves(payload);
      const result = await faq.getTopicDetail('5f3f664b-8992-4c34-b629-0341769c3178');
      query.prototype.findTopicFaq.restore();
      assert.equal(result.data.topicId, '5f3f664b-8992-4c34-b629-0341769c3178');
    });
  });

  describe('getAnswers', () => {
    const payload = {row:0, page:1, title:'', status:'', lastUpdated:''};
    it('should return error answer not result', async() => {
      sinon.stub(query.prototype, 'findAllAnswer').resolves({err: true});
      const result = await faq.getAnswers(payload);
      query.prototype.findAllAnswer.restore();
      assert.equal(result.err, 'Answer not result');
    });
    it('should return error topic not found', async() => {
      sinon.stub(query.prototype, 'findAllAnswer').resolves(answerManyResult);
      sinon.stub(query.prototype, 'countAnswer').resolves({});
      const result = await faq.getAnswers(payload);
      query.prototype.findAllAnswer.restore();
      query.prototype.countAnswer.restore();
      assert.equal(result.data[0].answerId, '5f3f664b-4c34-8992-b629-0341769c3178');
    });
  });

  describe('getAnswerDetail', () => {
    const payload = {
      err: null,
      data: {
        'answerId': 'd4bedc57-e9f1-45f2-936b-1d5bfe19de03',
        'keywords': '',
        'descriptionLangId': '<h3>Layanan mungkin di non-aktifkan untuk sementara waktu</h3>',
        'descriptionLangEn': '<h3>Service may be temporarily deactivated</h3>.',
        'publishDate': '2020-12-27',
        'status': 'active',
        'creatorId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'creatorName': 'Super Administrator',
        'updatedId': '88b33dcd-1680-433e-a9fe-8b9bd209b384',
        'updatedName': 'Super Administrator',
        'createdAt':'2020-12-27T08:10:58.248Z',
        'lastModified':'2021-01-25T03:53:53.570Z'
      }
    };
    it('should return error answer not found', async() => {
      sinon.stub(query.prototype, 'findAnswerOne').resolves({err: true});
      const result = await faq.getAnswerDetail('d4bedc57-e9f1-45f2-936b-1d5bfe19de03');
      query.prototype.findAnswerOne.restore();
      assert.equal(result.err.message, 'Answer not found');
    });
    it('should return should success', async() => {
      sinon.stub(query.prototype, 'findAnswerOne').resolves(payload);
      const result = await faq.getAnswerDetail('d4bedc57-e9f1-45f2-936b-1d5bfe19de03');
      query.prototype.findAnswerOne.restore();
      assert.equal(result.data.answerId, 'd4bedc57-e9f1-45f2-936b-1d5bfe19de03');
    });
  });

  describe('getQuestion', () => {
    let topicResult = {
      err: null,
      data: [{
        _id: '5bac53b45ea76b1e9bd58e1c',
        topicId: '5f3f664b-8992-4c34-b629-0341769c3178',
        categoryId: 'Internet',
        categoryEn: 'Internet',
        icon: '',
        createdAt: '2020-03-09T02:51:15.229Z',
        lastModified: '2020-07-27T07:00:57.102Z'
      },{
        _id: '5bac53b45ea76b1e9bd58ce1',
        topicId: '5f3f664b-8992-4c34-b629-0341769c3817',
        categoryId: 'TV',
        categoryEn: 'TV',
        icon: '',
        createdAt: '2020-03-09T02:51:15.229Z',
        lastModified: '2020-07-27T07:00:57.102Z'
      }]
    };
    let questionArrayResult = {
      'err': null,
      'data':[{
        '_id': '5efedd00e67fb170dcf9336a',
        'questionId': '6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
        'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
        'subCategory': 'Troubleshooting',
        'titleLangId': 'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
        'titleLangEn': 'All the services (phone, Internet and TV) are not working',
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
        'data': {
          _id: '5bac53b45ea76b1e9bd58e1c',
          topicId: '5f3f664b-8992-4c34-b629-0341769c3178',
          categoryId: 'Internet',
          categoryEn: 'Internet',
          icon: '',
          createdAt: '2020-03-09T02:51:15.229Z',
          lastModified: '2020-07-27T07:00:57.102Z'
        }
      }]
    };
    const payload = {row:0, page:1, title:'', status:'', lastUpdated:''};
    it('should return error question not result', async() => {
      sinon.stub(query.prototype, 'findAll').resolves(topicResult);
      sinon.stub(query.prototype, 'aggregateQuestion').resolves({err: true});
      const result = await faq.getQuestion(payload);
      query.prototype.findAll.restore();
      query.prototype.aggregateQuestion.restore();
      assert.equal(result.err, 'Question not result');
    });
    it('should return error topic not found', async() => {
      sinon.stub(query.prototype, 'findAll').resolves(topicResult);
      sinon.stub(query.prototype, 'aggregateQuestion').resolves(questionArrayResult);
      sinon.stub(query.prototype, 'countQuestion').resolves({});
      const result = await faq.getQuestion(payload);
      query.prototype.findAll.restore();
      query.prototype.aggregateQuestion.restore();
      query.prototype.countQuestion.restore();
      assert.equal(result.data[0].questionId, '6460a229-3ce7-4c6a-bc2d-252e1f88ade3');
    });
  });

  describe('getQuestionDetail', () => {
    const payload = {
      err: null,
      data: {
        '_id': '5efedd00e67fb170dcf9336a',
        'questionId': '6460a229-3ce7-4c6a-bc2d-252e1f88ade3',
        'topicId': '5f3f664b-8992-4c34-b629-0341769c3178',
        'subCategory': 'Troubleshooting',
        'titleLangId': 'Semua layanan (telepon, Internet, dan TV) tidak berfungsi',
        'titleLangEn': 'All the services (phone, Internet and TV) are not working',
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
        'lastModified': '2020-07-03T04:08:27.349Z'
      }
    };
    it('should return error question not found', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves({err: true});
      const result = await faq.getQuestionDetail('6460a229-3ce7-4c6a-bc2d-252e1f88ade3');
      query.prototype.findQuestionOne.restore();
      assert.equal(result.err.message, 'Question not found');
    });
    it('should return should success', async() => {
      sinon.stub(query.prototype, 'findQuestionOne').resolves(payload);
      sinon.stub(query.prototype, 'findAnswer').resolves(answerManyResult);
      const result = await faq.getQuestionDetail('6460a229-3ce7-4c6a-bc2d-252e1f88ade3');
      query.prototype.findQuestionOne.restore();
      query.prototype.findAnswer.restore();
      assert.equal(result.data.questionId, '6460a229-3ce7-4c6a-bc2d-252e1f88ade3');
    });
  });
});
