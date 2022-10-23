const commandHandler = require('../../../../../../bin/modules/issues/repositories/commands/command_handler');
const Issues = require('../../../../../../bin/modules/issues/repositories/commands/domain');
const sinon = require('sinon');
const assert = require('assert');

describe('Issues-commandHandler', () => {

  const data = {
    success: true,
    data: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
    message: 'Your Request Has Been Processed',
    code: 200
  };

  describe('createTicketIssue', () => {
    const payload = {
      'userId': '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
      'issueId': 'b8f83073-092e-4473-ab47-a3df613907f5',
      'message': 'All services (phone, Internet and TV) are not working',
      'type': 'INTERNET'
    };

    it('should return create ticket issue', async() => {
      sinon.stub(Issues.prototype, 'createTicketIssue').resolves(data);
      const rs = await commandHandler.createTicketIssue(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.createTicketIssue.restore();
    });
  });

  describe('postScheduleIssue', () => {
    const payload = {
      'userId': '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
      'bookingId': '1592276241108_3',
      'schedule':  {
        'slotId': 'morning',
        'slot': '10:00 - 12:00',
        'time': '11:00',
        'date': '16-06-2020'
      },
      'crewId': 'A2BIN010',
      'information': 'Crew pada STO terdekat',
      'contactSecondary': ''
    };

    it('should return create post schedule issue', async() => {
      sinon.stub(Issues.prototype, 'postScheduleIssue').resolves(data);
      const rs = await commandHandler.postScheduleIssue(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.postScheduleIssue.restore();
    });
  });

  describe('postReopenScheduleIssue', () => {
    const payload = {
      'userId': '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
      'bookingId': '1592276241108_3',
      'schedule':  {
        'slotId': 'morning',
        'slot': '10:00 - 12:00',
        'time': '11:00',
        'date': '16-06-2020'
      },
      'crewId': 'A2BIN010',
      'information': 'Crew pada STO terdekat',
      'contactSecondary': ''
    };

    it('should return post Reopen Schedule Issue', async() => {
      sinon.stub(Issues.prototype, 'postReopenScheduleIssue').resolves(data);
      const rs = await commandHandler.postReopenSchedule(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.postReopenScheduleIssue.restore();
    });
  });

  describe('reopenTicket', () => {
    const payload = {
      'transactionId':'MYINX-1596081376135'
    };

    it('should return reopen ticket', async() => {
      sinon.stub(Issues.prototype, 'rescheduleTicket').resolves(data);
      const rs = await commandHandler.reopenTicket(payload);
      assert.equal(rs.data, null);
      Issues.prototype.rescheduleTicket.restore();
    });
  });

  describe('rescheduleTicket', () => {
    const payload = {
      'transactionId':'MYINX-1596081376135'
    };

    it('should return reschedule ticket', async() => {
      sinon.stub(Issues.prototype, 'rescheduleTicket').resolves(data);
      const rs = await commandHandler.rescheduleTicket(payload);
      assert.equal(rs.data, 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9');
      Issues.prototype.rescheduleTicket.restore();
    });
  });

  describe('closeTicket', () => {
    const payload = {
      'transactionId':'MYINX-1596081376135'
    };

    it('should return close ticket', async() => {
      sinon.stub(Issues.prototype, 'closeTicket').resolves(data);
      const rs = await commandHandler.closeTicket(payload);
      assert.equal(rs.data, 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9');
      Issues.prototype.closeTicket.restore();
    });
  });

  describe('updateTicketId', () => {
    const payload = {
      'transactionId': 'MYINX-15916671112341',
      'ticketId': 'IN123456',
    };

    it('should return update ticket by id', async() => {
      sinon.stub(Issues.prototype, 'updateTicketId').resolves(data);
      const rs = await commandHandler.updateTicketId(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.updateTicketId.restore();
    });
  });

  describe('updateStatusTicket', () => {
    const payload = {
      'transactionId': 'MYINX-15916671112341',
      'ticketId': 'IN123456',
      'status': 'IN_PROGRESS'
    };

    it('should return update status ticket', async() => {
      sinon.stub(Issues.prototype, 'updateStatusTicket').resolves(data);
      const rs = await commandHandler.updateStatusTicket(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.updateStatusTicket.restore();
    });
  });

  describe('addComment', () => {
    const payload = {
      'issueId': 'MYINX-15916671112341',
      'comment': 'Test ketiga'
    };

    it('should return success inssert additional command', async() => {
      sinon.stub(Issues.prototype, 'addComment').resolves(data);
      const rs = await commandHandler.addComment(payload);
      assert.notEqual(rs.data, null);
      assert.equal(rs.code, 200);
      Issues.prototype.addComment.restore();
    });
  });
});
