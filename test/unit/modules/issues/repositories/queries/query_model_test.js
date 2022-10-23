const assert = require('assert');
const { expect } = require('chai');
const Issue = require('../../../../../../bin/modules/issues/repositories/queries/query_model');
const validator = require('../../../../../../bin/helpers/utils/validator');

describe('Issues Query model test', () => {
  it('should handle right model getTicketByIssueId', () => {
    let result = validator.isValidPayload({userId:'c94e6b80-8f6d-44be-af4b-bd5c3c99d340',
      issueId:'MYINX-1591943948198',lang:'id'}, Issue.getTicketByIssueId);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['userId','issueId','lang']);
    expect(result.err).to.be.null;
  });
  it('should return assuranceModel', async() => {
    const result = await Issue.assuranceModel('');
    assert.equal(result.categoryId, '');
  });
  it('should return issuesModel', async() => {
    const result = await Issue.issuesModel('');
    assert.equal(result.technicalLanguage, '');
  });
  it('should return availableService', async() => {
    const result = await Issue.availableService('');
    assert.equal(result.issueId, '');
  });
  it('should return detailTicket', async() => {
    const result = await Issue.detailTicket();
    assert.equal(result.category, '');
  });
  it('should return commentsModel', async() => {
    const result = await Issue.commentsModel('');
    assert.equal(result.message, '');
  });
});
