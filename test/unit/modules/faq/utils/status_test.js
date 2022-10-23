const assert = require('assert');
const status = require('../../../../../bin/modules/faq/utils/status');

describe('Status Gamas', () => {
  it('should return success title by lang id', async() => {
    const result = await status.gamasStatus('id', '12/08/2020');
    assert.equal(result.title, 'Saat ini daerah Anda sedang mengalami gangguan massal');
  });
  it('should return success title by lang en', async() => {
    const result = await status.gamasStatus('en', '12/08/2020');
    assert.equal(result.title, 'Saat ini daerah Anda sedang mengalami gangguan massal');
  });
});

describe('Get issueType', () => {
  it('should return get IPTV', async() => {
    const result = await status.issueType('TV');
    assert.equal(result, 'IPTV');
  });
  it('should return get TELEPHONE', async() => {
    const result = await status.issueType('TELEPHONE');
    assert.equal(result, 'VOICE');
  });
  it('should return get INTERNET', async() => {
    const result = await status.issueType('INTERNET');
    assert.equal(result, 'INTERNET');
  });
});
