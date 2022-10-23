const assert = require('assert');
const { expect } = require('chai');
const Issues = require('../../../../../../bin/modules/issues/repositories/commands/command_model');
const validator = require('../../../../../../bin/helpers/utils/validator');

describe('Issue Commend model test', () => {
  it('should handle right model Ticket', () => {
    let result = validator.isValidPayload({userId:'2b6e6b61-eb34-46d9-ba1c-ae22913273fb',issueId:'MYINX-1591943948198',
      type:'Internet',message:'Hallo',lang:'id'}, Issues.ticket);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['userId','issueId','type','message','lang']);
    expect(result.err).to.be.null;
  });
  it('should handle right model updateTicket', () => {
    let result = validator.isValidPayload({transactionId:'MYIRX-15931773633052',
      ticketId:'2b6e6b61-eb34-46d9-ba1c-ae22913273fb'}, Issues.updateTicket);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['transactionId','ticketId']);
    expect(result.err).to.be.null;
  });
  it('should handle right model statusTicket', () => {
    let result = validator.isValidPayload({transactionId:'MYIRX-15931773633052',
      ticketId:'2b6e6b61-eb34-46d9-ba1c-ae22913273fb',status:'IN_PROGRESS'}, Issues.statusTicket);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['transactionId','ticketId','status']);
    expect(result.err).to.be.null;
  });
  it('should handle right model addComments', () => {
    let result = validator.isValidPayload({issueId:'MYIRX-15931773633052',
      comment:'halo'}, Issues.addComments);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['issueId','comment']);
    expect(result.err).to.be.null;
  });
  it('should handle right model reopenTicket', () => {
    let result = validator.isValidPayload({userId:'2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
      transactionId:'MYIRX-15931773633052',message:'halo'}, Issues.reopenTicket);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['userId','transactionId','message']);
    expect(result.err).to.be.null;
  });
  it('should return issue', async() => {
    const result = await Issues.issue('');
    assert.equal(result.issueId, '');
  });
  it('should return schedule', async() => {
    const result = await Issues.schedule('');
    assert.equal(result.scheduleAttempt, 0);
  });
  it('should return responseResult', async() => {
    const result = await Issues.responseResult('');
    assert.equal(result.amount, 0);
  });
});
