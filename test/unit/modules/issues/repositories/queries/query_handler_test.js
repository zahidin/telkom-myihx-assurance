const assert = require('assert');
const sinon = require('sinon');
const queryHandler = require('../../../../../../bin/modules/issues/repositories/queries/query_handler');
const Issues = require('../../../../../../bin/modules/issues/repositories/queries/domain');

describe('Issues-queryHandler', () => {

  const data = {
    success: true,
    data: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
    message: 'Your Request Has Been Processed',
    code: 200
  };

  const payload = {
    'username': 'alifsn',
    'password': 'telkomdev'
  };

  describe('getTicketDetails', () => {
    it('should return success getTicketDetails', async() => {
      sinon.stub(Issues.prototype, 'getTicketDetails').resolves(data);
      const rs = await queryHandler.getTicketDetails(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.getTicketDetails.restore();
    });
  });
  describe('rescheduleTicket', () => {
    it('should return success rescheduleTicket', async() => {
      sinon.stub(Issues.prototype, 'rescheduleTicket').resolves(data);
      const rs = await queryHandler.rescheduleTicket(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.rescheduleTicket.restore();
    });
  });
});

