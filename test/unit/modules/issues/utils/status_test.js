const assert = require('assert');
const workStatus = require('../../../../../bin/modules/issues/utils/status');

describe('Work Status Isssues', () => {
  it('should return Ticket Fisik Submitted', async() => {
    const result = await workStatus.pending();
    assert.equal(result.title, 'PENDING');
  });

  it('should return Ticket Fisik Submitted', async() => {
    const result = await workStatus.status('SUBMITTED', 'MYINX-15916671112341', 'INTERNET', 'Fisik');
    assert.equal(result.title, 'Ticket Submitted');
  });

  it('should return Ticket Logic Submitted', async() => {
    const result = await workStatus.status('RECEIVED', 'MYINX-15916671112341', 'INTERNET', 'Logic');
    assert.equal(result.title, 'Report Received');
  });

  it('should return Ticket Assigned', async() => {
    const result = await workStatus.status('ASSIGNED');
    assert.equal(result.title, 'Ticket Assigned');
  });

  it('should return Repair In Progress', async() => {
    const result = await workStatus.status('IN_PROGRESS');
    assert.equal(result.title, 'Repair In Progress');
  });

  it('should return Repair Complete', async() => {
    const result = await workStatus.status('COMPLETED');
    assert.equal(result.title, 'Repair Complete');
  });

  it('should return Issue solved', async() => {
    const result = await workStatus.status('RESOLVED');
    assert.equal(result.title, 'Issue solved');
  });
});

describe('Status Categories', () => {
  it('should return Admin', async() => {
    const result = await workStatus.categories('ADMINISTRATION');
    assert.equal(result, 'Admin');
  });
  it('should return Fisik', async() => {
    const result = await workStatus.categories('Fisik');
    assert.equal(result, 'Fisik');
  });
});

describe('messageOutstanding', () => {
  it('should return Admin', async() => {
    const result = await workStatus.messageOutstanding('id');
    assert.equal(result.title, 'Anda belum melakukan pembayaran tagihan');
  });
  it('should return Fisik', async() => {
    const result = await workStatus.messageOutstanding('en');
    assert.equal(result.title, 'Sorry, you have an outstanding bill');
  });
});
