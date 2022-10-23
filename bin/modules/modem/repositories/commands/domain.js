
const Query = require('../queries/query');
const Command = require('./command');
const UserQuery = require('../../../user/repositories/queries/query');
const wrapper = require('../../../../helpers/utils/wrapper');
const commonUtil = require('../../../../helpers/utils/common');
const service = require('../../utils/service');
const model = require('./command_model');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, InternalServerError, ExpectationFailedError, UnauthorizedError } = require('../../../../helpers/error');

class Device {

  constructor(db){
    this.command = new Command(db);
    this.query = new Query(db);
    this.userQuery = new UserQuery(db);
  }

  async resetModem(userId) {
    const ctx = 'domain-resetModem';
    const user = await this.userQuery.findOneUser({ userId:userId });
    if (user.err) {
      return wrapper.error(new NotFoundError('user Not Found'));
    }

    const account = await this.userQuery.findOneAccount({users: {$elemMatch: {userId:userId, status: 'active', isDeleted: false}}});
    if (account.err){
      return wrapper.error(new NotFoundError('user dont have active Indihome account'));
    }
    const svm = account.data.users.find( (item) => item.userId === userId );
    let {verifiedEmail, email} = user.data;
    const svmLevel = (svm) ? svm.svmLevel : 0;
    const verifiedId = (svmLevel >= 1);
    if (!verifiedEmail) verifiedEmail = false;
    if (!verifiedEmail || svmLevel === 0){
      return wrapper.error(new UnauthorizedError({
        code: svmLevel === 0 ? 1002 : 1001,
        message: svmLevel === 0 ? 'ID not verified': 'Email not verified, please verify first',
        data: {
          svmLevel,
          verifiedEmail,
          verifiedId,
          email
        }
      }));
    }
    const indihomeNumber = account.data.indihomeNumber;
    const jwtData = await commonUtil.getJwtLegacy();
    if (jwtData.err) {
      return wrapper.error(new InternalServerError('Can\'t get legacy access token'));
    }

    const param = {
      indihomeNumber,
      realm: 'telkom.net',
      jwt: jwtData.data
    };

    const modem = model.modem();
    modem.indihomeNumber = indihomeNumber;
    modem.userId = userId;

    const modemStat = await service.resetModem(param);
    if(modemStat.err){
      logger.log(ctx, JSON.stringify(modemStat.err), 'resetModem Internal Server Error');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    if(modemStat.data.statusCode === '-2'){
      return wrapper.error(new ExpectationFailedError('Reset modem failed'));
    }

    const result = await this.query.findOneModem({indihomeNumber});
    if (result.err) {
      const obj = await this.command.insertOneModem(modem);
      if(obj.err) {
        return wrapper.error(new InternalServerError('Internal Server Error'));
      }
    }else {
      const data  = {
        $set: {
          rebootTime: new Date()
        }
      };
      const obj = await this.command.upsertOneModem({indihomeNumber}, data);
      if(obj.err) {
        return wrapper.error(new InternalServerError('Internal Server Error'));
      }
    }

    return wrapper.data('Reset modem success');
  }

}

module.exports = Device;
