const sinon = require('sinon');
const assert = require('assert');
const Modem = require('../../../../../../bin/modules/modem/repositories/queries/domain');
const queryHandler = require('../../../../../../bin/modules/modem/repositories/queries/query_handler');

describe('Modem queryHandler', () => {
  const data = {
    success: true,
    data: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
    message: 'Your Request Has Been Processed',
    code: 200
  };

  describe('getMobileNumber', () => {
    it('should return register user', async() => {
      sinon.stub(Modem.prototype, 'viewUser').resolves(data);
      const rs = await queryHandler.getUser('2b6e6b61-eb34-46d9-ba1c-ae22913273fb');
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Modem.prototype.viewUser.restore();
    });
  });
});
