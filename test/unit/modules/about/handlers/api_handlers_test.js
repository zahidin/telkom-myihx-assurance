const sinon = require('sinon');
const { expect } = require('chai');
const apiHandler = require('../../../../../bin/modules/about/handlers/api_handlers');
const queryHandler = require('../../../../../bin/modules/about/repositories/queries/query_handler');
const commandHandler = require('../../../../../bin/modules/about/repositories/commands/command_handler');
const validator = require('../../../../../bin/helpers/utils/validator');


describe('Issues Api Handler', () => {
  let res;
  beforeEach(() => {
    res = {
      send: function () {
        return true;
      }
    };
  });

  const req = {
    body: {},
    params: {},
    query: {},
    files: {
      iconWebsite: {
        name: 'name'
      },
      iconMobile: {
        name: 'mobile'
      },
      socialMediaWebsite: {
        name: 'website'
      },
      socialMediaMobile: {
        name: 'mobile'
      }
    },
    authorization: {
      credentials:'xx'
    },
    user: {
      id:'xx',
      name:'xx'
    },
    headers: [
      'accept-language', 'id'
    ]
  };

  const resultSucces = {
    err: null,
    message:'success',
    data: [],
    code: 200
  };

  const resultError = {
    err: true
  };

  describe('Get About', () => {
    it('Should return error validation', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'getAbout').resolves(resultError);
      expect(await apiHandler.getAbout(req, res));
      queryHandler.getAbout.restore();
      validator.isValidPayload.restore();
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getAbout').resolves(resultError);
      expect(await apiHandler.getAbout(req, res));
      queryHandler.getAbout.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: false,
        data: {}
      });
      sinon.stub(queryHandler, 'getAbout').resolves(resultSucces);
      expect(await apiHandler.getAbout(req, res));
      queryHandler.getAbout.restore();
      validator.isValidPayload.restore();
    });
    it('Should return success with language en', async () => {
      const customReq = {...req,headers:{'accept-language':'en'}};
      sinon.stub(validator, 'isValidPayload').resolves({
        err: false,
        data: {}
      });
      sinon.stub(queryHandler, 'getAbout').resolves(resultSucces);
      expect(await apiHandler.getAbout(customReq, res));
      queryHandler.getAbout.restore();
      validator.isValidPayload.restore();
    });
  });

  describe('About', () => {
    it('Should return error validation', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'about').resolves(resultError);
      expect(await apiHandler.about(req, res));
      queryHandler.about.restore();
      validator.isValidPayload.restore();
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'about').resolves(resultError);
      expect(await apiHandler.about(req, res));
      queryHandler.about.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: false,
        data: {}
      });
      sinon.stub(queryHandler, 'about').resolves(resultSucces);
      expect(await apiHandler.about(req, res));
      queryHandler.about.restore();
      validator.isValidPayload.restore();
    });
    it('Should return success with language en', async () => {
      const customReq = {...req,headers:{'accept-language':'en'}};
      sinon.stub(validator, 'isValidPayload').resolves({
        err: false,
        data: {}
      });
      sinon.stub(queryHandler, 'about').resolves(resultSucces);
      expect(await apiHandler.about(customReq, res));
      queryHandler.about.restore();
      validator.isValidPayload.restore();
    });
  });

  describe('Get About by id', () => {
    it('Should return error validation', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'getAboutId').resolves(resultError);
      expect(await apiHandler.getAboutId(req, res));
      queryHandler.getAboutId.restore();
      validator.isValidPayload.restore();
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getAboutId').resolves(resultError);
      expect(await apiHandler.getAboutId(req, res));
      queryHandler.getAboutId.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: false,
        data: {}
      });
      sinon.stub(queryHandler, 'getAboutId').resolves(resultSucces);
      expect(await apiHandler.getAboutId(req, res));
      queryHandler.getAboutId.restore();
      validator.isValidPayload.restore();
    });
  });

  describe('Post about',() => {
    it('Should cover error validation', async () => {
      await apiHandler.postAbout(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err:true,
        data:{}
      });

      sinon.stub(commandHandler,'postAbout').resolves(resultError);
      expect(await apiHandler.postAbout(req,res));
      validator.isValidPayload.restore();
      commandHandler.postAbout.restore();
    });
    it('Should return success',async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err:false,
        data:{}
      });
      sinon.stub(commandHandler, 'postAbout').resolves(resultSucces);
      expect(await apiHandler.postAbout(req,res));
      validator.isValidPayload.restore();
      commandHandler.postAbout.restore();
    });
  });

  describe('Update about',() => {
    it('Should cover error validation', async () => {
      await apiHandler.updateAbout(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err:true,
        data:{}
      });

      sinon.stub(commandHandler,'updateAbout').resolves(resultError);
      expect(await apiHandler.updateAbout(req,res));
      validator.isValidPayload.restore();
      commandHandler.updateAbout.restore();
    });
    it('Should return success',async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err:false,
        data:{}
      });
      sinon.stub(commandHandler, 'updateAbout').resolves(resultSucces);
      expect(await apiHandler.updateAbout(req,res));
      validator.isValidPayload.restore();
      commandHandler.updateAbout.restore();
    });
  });

  describe('Delete about',() => {
    it('Should cover error validation', async () => {
      await apiHandler.removeAbout(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err:true,
        data:{}
      });

      sinon.stub(commandHandler,'removeAbout').resolves(resultError);
      expect(await apiHandler.removeAbout(req,res));
      validator.isValidPayload.restore();
      commandHandler.removeAbout.restore();
    });
    it('Should return success',async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err:false,
        data:{}
      });
      sinon.stub(commandHandler, 'removeAbout').resolves(resultSucces);
      expect(await apiHandler.removeAbout(req,res));
      validator.isValidPayload.restore();
      commandHandler.removeAbout.restore();
    });
  });
})
;
