const rp = require('request-promise');
const sinon = require('sinon');
const assert = require('assert');
const service = require('../../../../../bin/modules/issues/utils/service');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('Issue Utils Service', () => {
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

  describe('getPelanggan', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.getPelanggan(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success getPelanggan', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
      };
      sinon.stub(rp, 'post').resolves({indihomeNumber: '1234567890'});
      const result = await service.getPelanggan(payload);
      rp.post.restore();
      assert.equal(result.indihomeNumber, '1234567890');
    });
  });

  describe('checkCableType', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        service: 'SERVICE',
        indihomeNumber: '1234567890',
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.checkCableType(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success checkCableType', async () => {
      const payload = {
        jwt: 'token',
        service: 'SERVICE',
        indihomeNumber: '1234567890',
      };
      sinon.stub(rp, 'post').resolves({indihomeNumber: '1234567890'});
      const result = await service.checkCableType(payload);
      rp.post.restore();
      assert.equal(result.indihomeNumber, '1234567890');
    });
  });

  describe('getIboosterInfo', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.getIboosterInfo(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success getIboosterInfo', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '1234567890',
      };
      sinon.stub(rp, 'post').resolves({indihomeNumber: '1234567890'});
      const result = await service.getIboosterInfo(payload);
      rp.post.restore();
      assert.equal(result.indihomeNumber, '1234567890');
    });
  });

  describe('getDetailTeknisi', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        crewId: 'CRW-1234567890',
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.getDetailTeknisi(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success getDetailTeknisi', async () => {
      const payload = {
        jwt: 'token',
        crewId: 'CRW-1234567890',
      };
      sinon.stub(rp, 'post').resolves({crewId: 'CRW-1234567890'});
      const result = await service.getDetailTeknisi(payload);
      rp.post.restore();
      assert.equal(result.crewId, 'CRW-1234567890');
    });
  });

  describe('reportIssue', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        params: {
          assetNum: 'dasdasd',
          user: {
            fullName:'miral'
          },
          symptom: {
            descriptionEn: 'dasdasdasd'
          },
          ticketType: 'Admin'
        },
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.reportIssue(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success reportIssue ticketType logic/Fisik', async () => {
      const payload = {
        jwt: 'token',
        params: {
          assetNum: '50013342_122207444217_INTERNET',
          user: {
            fullName:'miral'
          },
          symptom: {
            descriptionEn: 'dasdasdasd'
          },
          ticketType: 'logic'
        },
      };
      sinon.stub(rp, 'post').resolves(payload);
      const result = await service.reportIssue(payload);
      rp.post.restore();
      assert.equal(result.params.assetNum, '50013342_122207444217_INTERNET');
    });
    it('should return success reportIssue ticketType Admin', async () => {
      const payload = {
        jwt: 'token',
        params: {
          assetNum: '50013342_122207444217_INTERNET',
          user: {
            fullName:'miral'
          },
          symptom: {
            descriptionEn: 'dasdasdasd'
          },
          ticketType: 'Admin'
        },
      };
      sinon.stub(rp, 'post').resolves(payload);
      const result = await service.reportIssue(payload);
      rp.post.restore();
      assert.equal(result.params.assetNum, '50013342_122207444217_INTERNET');
    });
  });

  describe('reportReopenIssue', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        params: {
          ticketType: 'ADMIN',
          transactionId: '',
          bookingId: '',
          symptomId: '',
          assetNum: 'dasdasd',
          user: {
            fullName:'miral',
            email:'',
            mobileNumber:''
          },
          symptom: {
            descriptionEn: 'dasdasdasd',
            technicalLanguage: ''
          },
          message:''
        },
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.reportReopenIssue(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });

    it('should return success reportReopenIssue', async () => {
      const payload = {
        jwt: 'token',
        params: {
          assetNum: '50013342_122207444217_INTERNET',
          user: {
            fullName:'miral'
          },
          symptom: {
            descriptionEn: 'dasdasdasd'
          }
        },
      };
      sinon.stub(rp, 'post').resolves(payload);
      const result = await service.reportReopenIssue(payload);
      rp.post.restore();
      assert.equal(result.params.assetNum, '50013342_122207444217_INTERNET');
    });
  });

  describe('setReopenTicket', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        ticketId: '1234567890',
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.setReopenTicket(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success mediaCaringFaultHandling', async () => {
      const payload = {
        jwt: 'token',
        ticketId: '1234567890',
      };
      sinon.stub(rp, 'post').resolves({ticketId: '1234567890'});
      const result = await service.setReopenTicket(payload);
      rp.post.restore();
      assert.equal(result.ticketId, '1234567890');
    });
  });

  describe('getAvailableTechnicianPsbService', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        crewId: '1234567890',
        date: '2020-08-09'
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.getAvailableTechnicianPsbService(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success mediaCaringFaultHandling', async () => {
      const payload = {
        jwt: 'token',
        crewId: '1234567890',
        date: '2020-08-09'
      };
      sinon.stub(rp, 'post').resolves({crewId: '1234567890'});
      const result = await service.getAvailableTechnicianPsbService(payload);
      rp.post.restore();
      assert.equal(result.crewId, '1234567890');
    });
  });

  describe('checkInquiry', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '123456'
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.checkInquiry(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Check Inquiry Error');
    });
    it('should return success mediaCaringFaultHandling', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '123456'
      };
      sinon.stub(rp, 'post').resolves({indihomeNumber: '123456'});
      const result = await service.checkInquiry(payload);
      rp.post.restore();
      assert.equal(result.indihomeNumber, '123456');
    });
  });

  describe('getPortofolio', () => {
    it('should return Internal server error', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '123456'
      };
      sinon.stub(rp, 'post').rejects();
      const result = await service.getPortofolio(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success mediaCaringFaultHandling', async () => {
      const payload = {
        jwt: 'token',
        indihomeNumber: '123456'
      };
      sinon.stub(rp, 'post').resolves({indihomeNumber: '123456'});
      const result = await service.getPortofolio(payload);
      rp.post.restore();
      assert.equal(result.indihomeNumber, '123456');
    });
  });

  describe('getServiceTechnicianPsbParallel', () => {
    const payload = {
      jwt: 'eb457622b6fd2231e522befeebf0278f5d8875ebxxxx',
      numberOfDays: 14,
      sto: 'A2BIN010',
      startDate: '2020-09-11T02:33:31.078+00:00'
    };
    const resultPsbTechnician = {
      statusCode: '0',
      returnMessage: 'Success',
      data: {
        schedule: [
          {
            jadwal: '03-12-2020 08:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_0'
          },
          {
            jadwal: '03-12-2020 09:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_1'
          },
          {
            jadwal: '03-12-2020 10:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_2'
          },
          {
            jadwal: '03-12-2020 11:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_3'
          },
          {
            jadwal: '03-12-2020 13:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_4'
          },
          {
            jadwal: '03-12-2020 14:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_5'
          },
          {
            jadwal: '03-12-2020 15:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_6'
          },
          {
            jadwal: '03-12-2020 16:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374310888_7'
          },
          {
            jadwal: '03-12-2020 17:00',
            availability: 'NOT AVAILABLE',
            crewID: '',
            bookingId: ''
          },
          {
            jadwal: '04-12-2020 08:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_0'
          },
          {
            jadwal: '04-12-2020 09:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_1'
          },
          {
            jadwal: '04-12-2020 10:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_2'
          },
          {
            jadwal: '04-12-2020 11:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_3'
          },
          {
            jadwal: '04-12-2020 13:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_4'
          },
          {
            jadwal: '04-12-2020 14:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_5'
          },
          {
            jadwal: '04-12-2020 15:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_6'
          },
          {
            jadwal: '04-12-2020 16:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311076_7'
          },
          {
            jadwal: '04-12-2020 17:17',
            availability: 'NOT AVAILABLE',
            crewID: '',
            bookingId: ''
          },
          {
            jadwal: '05-12-2020 08:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_0'
          },
          {
            jadwal: '05-12-2020 09:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_1'
          },
          {
            jadwal: '05-12-2020 10:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_2'
          },
          {
            jadwal: '05-12-2020 11:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_3'
          },
          {
            jadwal: '05-12-2020 13:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_4'
          },
          {
            jadwal: '05-12-2020 14:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_5'
          },
          {
            jadwal: '05-12-2020 15:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_6'
          },
          {
            jadwal: '05-12-2020 16:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311202_7'
          },
          {
            jadwal: '05-12-2020 17:17',
            availability: 'NOT AVAILABLE',
            crewID: '',
            bookingId: ''
          },
          {
            jadwal: '06-12-2020 08:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_0'
          },
          {
            jadwal: '06-12-2020 09:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_1'
          },
          {
            jadwal: '06-12-2020 10:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_2'
          },
          {
            jadwal: '06-12-2020 11:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_3'
          },
          {
            jadwal: '06-12-2020 13:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_4'
          },
          {
            jadwal: '06-12-2020 14:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_5'
          },
          {
            jadwal: '06-12-2020 15:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_6'
          },
          {
            jadwal: '06-12-2020 16:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311328_7'
          },
          {
            jadwal: '06-12-2020 17:17',
            availability: 'NOT AVAILABLE',
            crewID: '',
            bookingId: ''
          },
          {
            jadwal: '07-12-2020 08:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_0'
          },
          {
            jadwal: '07-12-2020 09:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_1'
          },
          {
            jadwal: '07-12-2020 10:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_2'
          },
          {
            jadwal: '07-12-2020 11:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_3'
          },
          {
            jadwal: '07-12-2020 13:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_4'
          },
          {
            jadwal: '07-12-2020 14:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_5'
          },
          {
            jadwal: '07-12-2020 15:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_6'
          },
          {
            jadwal: '07-12-2020 16:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311469_7'
          },
          {
            jadwal: '07-12-2020 17:17',
            availability: 'NOT AVAILABLE',
            crewID: '',
            bookingId: ''
          },
          {
            jadwal: '08-12-2020 08:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_0'
          },
          {
            jadwal: '08-12-2020 09:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_1'
          },
          {
            jadwal: '08-12-2020 10:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_2'
          },
          {
            jadwal: '08-12-2020 11:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_3'
          },
          {
            jadwal: '08-12-2020 13:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_4'
          },
          {
            jadwal: '08-12-2020 14:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_5'
          },
          {
            jadwal: '08-12-2020 15:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_6'
          },
          {
            jadwal: '08-12-2020 16:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311612_7'
          },
          {
            jadwal: '08-12-2020 17:17',
            availability: 'NOT AVAILABLE',
            crewID: '',
            bookingId: ''
          },
          {
            jadwal: '09-12-2020 08:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_0'
          },
          {
            jadwal: '09-12-2020 09:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_1'
          },
          {
            jadwal: '09-12-2020 10:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_2'
          },
          {
            jadwal: '09-12-2020 11:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_3'
          },
          {
            jadwal: '09-12-2020 13:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_4'
          },
          {
            jadwal: '09-12-2020 14:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_5'
          },
          {
            jadwal: '09-12-2020 15:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_6'
          },
          {
            jadwal: '09-12-2020 16:00',
            availability: 'AVAILABLE',
            crewID: 'CREWMIHX',
            bookingId: '1606374311767_7'
          },
          {
            jadwal: '09-12-2020 17:17',
            availability: 'NOT AVAILABLE',
            crewID: '',
            bookingId: ''
          }
        ]
      }
    };
    it('should return Internal server error', async () => {
      sinon.stub(service, 'getAvailableTechnicianPsbService').resolves({err:true});
      const result = await service.getServiceTechnicianPsbParallel(payload);
      service.getAvailableTechnicianPsbService.restore();
      assert.equal(result, '');
    });
    it('should return success', async () => {
      sinon.stub(service, 'getAvailableTechnicianPsbService').resolves(resultPsbTechnician);
      const result = await service.getServiceTechnicianPsbParallel(payload);
      service.getAvailableTechnicianPsbService.restore();
      assert.equal(result, '');
    });
  });

  describe('getAvailableServiceTimes', () => {
    const payload = {
      jwt: 'token',
      date: '2020-08-09',
      sto: 'CREWMIHX'
    };
    it('should return Internal server error', async () => {
      sinon.stub(rp, 'post').rejects();
      const result = await service.getAvailableServiceTimes(payload);
      rp.post.restore();
      assert.equal(result.err.message, 'Internal server error');
    });
    it('should return success getAvailableServiceTimes', async () => {
      sinon.stub(rp, 'post').resolves({sto: 'CREWMIHX'});
      const result = await service.getAvailableServiceTimes(payload);
      rp.post.restore();
      assert.equal(result.sto, 'CREWMIHX');
    });
  });

  describe('getServiceTimesParallel', () => {
    const payload = {
      jwt: 'eb457622b6fd2231e522befeebf0278f5d8875ebxxxx',
      numberOfDays: 14,
      sto: 'A2BIN010',
      startDate: '2020-11-26T02:33:31.078+00:00'
    };
    it('should return Internal server error', async () => {
      sinon.stub(service, 'getAvailableServiceTimes').rejects();
      const result = await service.getServiceTimesParallel (payload);
      service.getAvailableServiceTimes.restore();
      assert.equal(result.data, null);
    });
    it('should return success getAvailableServiceTimes', async () => {
      const resultCore = [
        {
          statusCode: '-2',
          returnMessage: 'nested exception is: psdi.util.MXSystemException: BMXAA4214E - An unknown error has occurred.\n'
        },
        {
          statusCode: '-2',
          returnMessage: 'nested exception is: psdi.util.MXSystemException: BMXAA4214E - An unknown error has occurred.\n'
        },
        {
          statusCode: '0',
          returnMessage: 'OK',
          data: {
            SCHEDULE: [
              {
                'mx:JADWAL': '27-11-2020 08:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_0'
              },
              {
                'mx:JADWAL': '27-11-2020 09:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_1'
              },
              {
                'mx:JADWAL': '27-11-2020 10:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_2'
              },
              {
                'mx:JADWAL': '27-11-2020 11:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_3'
              },
              {
                'mx:JADWAL': '27-11-2020 13:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_4'
              },
              {
                'mx:JADWAL': '27-11-2020 14:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_5'
              },
              {
                'mx:JADWAL': '27-11-2020 15:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_6'
              },
              {
                'mx:JADWAL': '27-11-2020 16:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_7'
              },
              {
                'mx:JADWAL': '27-11-2020 17:00',
                'mx:AVAILABILITY': 'NOT AVAILABLE',
                'mx:CREWID': '',
                'mx:KETERANGAN': '',
                'mx:BOOKINGID': ''
              }
            ]
          }
        },
        {
          statusCode: '0',
          returnMessage: 'OK',
          data: {
            SCHEDULE: [
              {
                'mx:JADWAL': '27-11-2020 08:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_0'
              },
              {
                'mx:JADWAL': '27-11-2020 09:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_1'
              },
              {
                'mx:JADWAL': '27-11-2020 10:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_2'
              },
              {
                'mx:JADWAL': '27-11-2020 11:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_3'
              },
              {
                'mx:JADWAL': '27-11-2020 13:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_4'
              },
              {
                'mx:JADWAL': '27-11-2020 14:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_5'
              },
              {
                'mx:JADWAL': '27-11-2020 15:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_6'
              },
              {
                'mx:JADWAL': '27-11-2020 16:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_7'
              },
              {
                'mx:JADWAL': '27-11-2020 17:00',
                'mx:AVAILABILITY': 'NOT AVAILABLE',
                'mx:CREWID': '',
                'mx:KETERANGAN': '',
                'mx:BOOKINGID': ''
              }
            ]
          }
        },
        {
          statusCode: '-2',
          returnMessage: 'nested exception is: psdi.util.MXSystemException: BMXAA4214E - An unknown error has occurred.\n'
        },
        {
          statusCode: '0',
          returnMessage: 'OK',
          data: {
            SCHEDULE: [
              {
                'mx:JADWAL': '27-11-2020 08:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_0'
              },
              {
                'mx:JADWAL': '27-11-2020 09:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_1'
              },
              {
                'mx:JADWAL': '27-11-2020 10:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_2'
              },
              {
                'mx:JADWAL': '27-11-2020 11:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_3'
              },
              {
                'mx:JADWAL': '27-11-2020 13:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_4'
              },
              {
                'mx:JADWAL': '27-11-2020 14:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_5'
              },
              {
                'mx:JADWAL': '27-11-2020 15:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_6'
              },
              {
                'mx:JADWAL': '27-11-2020 16:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_7'
              },
              {
                'mx:JADWAL': '27-11-2020 17:00',
                'mx:AVAILABILITY': 'NOT AVAILABLE',
                'mx:CREWID': '',
                'mx:KETERANGAN': '',
                'mx:BOOKINGID': ''
              }
            ]
          }
        },
        {
          statusCode: '0',
          returnMessage: 'OK',
          data: {
            SCHEDULE: [
              {
                'mx:JADWAL': '27-11-2020 08:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_0'
              },
              {
                'mx:JADWAL': '27-11-2020 09:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_1'
              },
              {
                'mx:JADWAL': '27-11-2020 10:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_2'
              },
              {
                'mx:JADWAL': '27-11-2020 11:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_3'
              },
              {
                'mx:JADWAL': '27-11-2020 13:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_4'
              },
              {
                'mx:JADWAL': '27-11-2020 14:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_5'
              },
              {
                'mx:JADWAL': '27-11-2020 15:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_6'
              },
              {
                'mx:JADWAL': '27-11-2020 16:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_7'
              },
              {
                'mx:JADWAL': '27-11-2020 17:00',
                'mx:AVAILABILITY': 'NOT AVAILABLE',
                'mx:CREWID': '',
                'mx:KETERANGAN': '',
                'mx:BOOKINGID': ''
              }
            ]
          }
        },
        {
          statusCode: '0',
          returnMessage: 'OK',
          data: {
            SCHEDULE: [
              {
                'mx:JADWAL': '27-11-2020 08:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_0'
              },
              {
                'mx:JADWAL': '27-11-2020 09:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_1'
              },
              {
                'mx:JADWAL': '27-11-2020 10:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_2'
              },
              {
                'mx:JADWAL': '27-11-2020 11:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_3'
              },
              {
                'mx:JADWAL': '27-11-2020 13:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_4'
              },
              {
                'mx:JADWAL': '27-11-2020 14:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_5'
              },
              {
                'mx:JADWAL': '27-11-2020 15:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_6'
              },
              {
                'mx:JADWAL': '27-11-2020 16:00',
                'mx:AVAILABILITY': 'AVAILABLE',
                'mx:CREWID': 'A2BIN010',
                'mx:KETERANGAN': 'Crew pada STO terdekat',
                'mx:BOOKINGID': '1606378766803_7'
              },
              {
                'mx:JADWAL': '27-11-2020 17:00',
                'mx:AVAILABILITY': 'NOT AVAILABLE',
                'mx:CREWID': '',
                'mx:KETERANGAN': '',
                'mx:BOOKINGID': ''
              }
            ]
          }
        },
        {
          statusCode: '-2',
          returnMessage: 'nested exception is: psdi.util.MXSystemException: BMXAA4214E - An unknown error has occurred.\n'
        }
      ];
      sinon.stub(service, 'getAvailableServiceTimes').resolves(resultCore);
      const result = await service.getServiceTimesParallel (payload);
      service.getAvailableServiceTimes.restore();
      assert.equal(result.data, null);
    });
  });
});
