const sinon = require('sinon');
const assert = require('assert');
const Modem = require('../../../../../../bin/modules/modem/repositories/commands/domain');
const query = require('../../../../../../bin/modules/user/repositories/queries/query');
const queryModem = require('../../../../../../bin/modules/modem/repositories/queries/query');
const command = require('../../../../../../bin/modules/modem/repositories/commands/command');
const commonUtil = require('../../../../../../bin/helpers/utils/common');
const service = require('../../../../../../bin/modules/modem/utils/service');

describe('Modem', () => {
  const db = {
    setCollection: sinon.stub()
  };

  const modem = new Modem(db);

  describe('Reset Modem', () => {
    let accountResult = {
      err: null,
      data: {
        indihomeNumber: '1234567891011',
        locId: 'ODP-BIN-FBU/38',
        ncli: '50078137',
        phoneNumber: '',
        sto: 'BIN',
        users: [
          {
            userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
            portfolioId: '',
            status: 'active',
            svmLevel: 2,
            isPrimary: true,
            isDeleted: false
          },
          {
            userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8d',
            portfolioId: '',
            status: 'active',
            svmLevel: 2,
            isPrimary: false,
            isDeleted: false
          }
        ]
      }
    };
    let userTemp = {
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
        verifiedEmail: true,
        token: '',
        verifyForgotPassword: false,
        createdAt: '2020-03-09T02:51:15.229Z',
        lastModified: '2020-07-27T07:00:57.102Z',
        profilePicture: 'http://minio-palapaone-dev.vsan-apps.playcourt.id/palapaone/users/default_profile_picture.jpeg',
        forgotPasswordAttempt: 0,
        blockAccountDate: ''
      }
    };
    let payload = 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c';

    const responseJwt = {
      data: 'eb457622b6fd2231e522befeebf0278f5d8875ebxxxx'
    };

    it('should return error user not found', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves({err:true});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      assert.equal(result.data, null);
    });

    it('should return error didnt have active portofolio', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves({err:true});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      assert.equal(result.data, null);
    });

    it('should return error svm 0', async() => {
      let accountRes = {
        err: null,
        data: {
          indihomeNumber: '123456679846',
          locId: 'ODP-BIN-FBU/38',
          ncli: '50078137',
          phoneNumber: '',
          sto: 'BIN',
          users: [
            {
              userId: 'a416d6c2-a2b8-4e03-9816-1b92bdc9ab8c',
              portfolioId: '',
              status: 'active',
              svmLevel: 0,
              isPrimary: false,
              isDeleted: false,
            }
          ]
        }
      };
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountRes);
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      assert.equal(result.data, null);
    });

    it('should return error didnt get jwt', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves({err:true});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      assert.equal(result.data, null);
    });

    it('should return error check ibooster', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({err:true});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      assert.equal(result.data, null);
    });

    it('should return error physical ticket', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({data: {ukurResponse: {output:{onu_rx_pwr:{$:-26}}}}});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      assert.equal(result.data, null);
    });

    it('should return error resetModem', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({data: {ukurResponse: {output:{onu_rx_pwr:-10}}}});
      sinon.stub(service, 'resetModem').resolves({err:true});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      service.resetModem.restore();
      assert.equal(result.data, null);
    });

    it('should return error Reset modem failed', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({data: {ukurResponse: {output:{onu_rx_pwr:-10}}}});
      sinon.stub(service, 'resetModem').resolves({data:{statusCode:'-2'}});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      service.resetModem.restore();
      assert.equal(result.data, null);
    });

    it('should return error insert OneModem', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({data: {ukurResponse: {output:{onu_rx_pwr:-10}}}});
      sinon.stub(service, 'resetModem').resolves({data:{statusCode:'0',returnMessage: 'Reboot Ont Berhasil'}});
      sinon.stub(queryModem.prototype, 'findOneModem').resolves({err:true});
      sinon.stub(command.prototype, 'insertOneModem').resolves({err:true});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      service.resetModem.restore();
      queryModem.prototype.findOneModem.restore();
      command.prototype.insertOneModem.restore();
      assert.equal(result.data, null);
    });

    it('should return success insert OneModem', async() => {
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({data: {ukurResponse: {output:{onu_rx_pwr:-10}}}});
      sinon.stub(service, 'resetModem').resolves({data:{statusCode:'0',returnMessage: 'Reboot Ont Berhasil'}});
      sinon.stub(queryModem.prototype, 'findOneModem').resolves({err:true});
      sinon.stub(command.prototype, 'insertOneModem').resolves({err:null});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      service.resetModem.restore();
      queryModem.prototype.findOneModem.restore();
      command.prototype.insertOneModem.restore();
      assert.equal(result.data, 'Reset modem success');
    });

    it('should return error upsertOneModem', async() => {
      let resModem = {
        'err': null,
        'data': {
          '_id': '5f087c3490c4a89aa42d72c2',
          'indihomeNumber': '1234567890',
        }
      };
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({data: {ukurResponse: {output:{onu_rx_pwr:-10}}}});
      sinon.stub(service, 'resetModem').resolves({data:{statusCode:'0',returnMessage: 'Reboot Ont Berhasil'}});
      sinon.stub(queryModem.prototype, 'findOneModem').resolves(resModem);
      sinon.stub(command.prototype, 'upsertOneModem').resolves({err:true});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      service.resetModem.restore();
      queryModem.prototype.findOneModem.restore();
      command.prototype.upsertOneModem.restore();
      assert.equal(result.data, null);
    });

    it('should return success upsertOneModem', async() => {
      let resModem = {
        'err': null,
        'data': {
          '_id': '5f087c3490c4a89aa42d72c2',
          'indihomeNumber': '1234567890',
        }
      };
      sinon.stub(query.prototype, 'findOneUser').resolves(userTemp);
      sinon.stub(query.prototype, 'findOneAccount').resolves(accountResult);
      sinon.stub(commonUtil, 'getJwtLegacy').resolves(responseJwt);
      sinon.stub(service, 'checkIbooster').resolves({data: {ukurResponse: {output:{onu_rx_pwr:-10}}}});
      sinon.stub(service, 'resetModem').resolves({data:{statusCode:'0',returnMessage: 'Reboot Ont Berhasil'}});
      sinon.stub(queryModem.prototype, 'findOneModem').resolves(resModem);
      sinon.stub(command.prototype, 'upsertOneModem').resolves({err:null});
      const result = await modem.resetModem(payload);
      query.prototype.findOneUser.restore();
      query.prototype.findOneAccount.restore();
      commonUtil.getJwtLegacy.restore();
      service.checkIbooster.restore();
      service.resetModem.restore();
      queryModem.prototype.findOneModem.restore();
      command.prototype.upsertOneModem.restore();
      assert.equal(result.data, 'Reset modem success');
    });
  });
});
