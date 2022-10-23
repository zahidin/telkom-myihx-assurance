const assert = require('assert');
const common = require('../../../../../bin/modules/issues/utils/common');

describe('Common Isssues', () => {
  it('should return card', async() => {
    const result = common.card();
    assert.equal(result.userId, '');
  });
  it('should return sendAssuranceCardToKafka', async() => {
    const payload = {
      userId: '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
      issueId: 'MYINX-1603278787605',
      indihomeNumber: '152320233711',
      issueType: 'INTERNET',
      ticketType: 'Admin',
      status: 'open',
      work: 'SUBMITTED',
      read: '1',
      createdAt: '2021-02-01T07:57:05.461+00:00',
      lastModified: '2021-02-01T07:57:05.461+00:00'
    };
    const result = await common.sendAssuranceCardToKafka(payload);
    assert.equal(result, undefined);
  });
});



