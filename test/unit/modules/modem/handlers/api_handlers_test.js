const sinon = require('sinon');
const { expect } = require('chai');
const modemHandler = require('../../../../../bin/modules/modem/handlers/api_handler');
const commandHandler = require('../../../../../bin/modules/modem/repositories/commands/command_handler');

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
    authorization: {
      credentials: 'xx'
    }
  };

  const resultSucces = {
    err: null,
    message: 'success',
    data: [],
    code: 200
  };

  const resultError = {
    err: true
  };

  describe('Reset Modem', () => {
    it('should cover error validation', async () => {
      await modemHandler.resetModem(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(commandHandler, 'resetModem').resolves(resultError);
      expect(await modemHandler.resetModem(req, res));
      commandHandler.resetModem.restore();
    });
    it('Should return success', async () => {
      sinon.stub(commandHandler, 'resetModem').resolves(resultSucces);
      expect(await modemHandler.resetModem(req, res));
      commandHandler.resetModem.restore();
    });
  });
});
