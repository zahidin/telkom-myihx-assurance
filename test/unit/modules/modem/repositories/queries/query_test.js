const assert = require('assert');
const sinon = require('sinon');
const Query = require('../../../../../../bin/modules/modem/repositories/queries/query');

describe('Modem query', () => {
  it('should return success FAQ question by Category', async() => {
    const db = {
      setCollection: sinon.stub(),
      findOne: sinon.stub().resolves({
        'err': null,
        'data': {
          '_id': '5f087c3490c4a89aa42d72c2',
          'indihomeNumber': '1234567890',
        }
      })
    };
    const query = new Query(db);
    const result = await query.findOneModem('1234567890');
    assert.notEqual(result.data, null);
    assert.equal(result.data.indihomeNumber, '1234567890');
  });
});
