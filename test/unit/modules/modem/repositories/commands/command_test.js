const assert = require('assert');
const sinon = require('sinon');
const Command = require('../../../../../../bin/modules/modem/repositories/commands/command');

describe('Modem-command', () => {
  const queryResult = {
    'err': null,
    'data': {
      '_id': '5efedd00e67fb170dcf9336a',
      'indihomeNumber': '123456679928',
      'userId': '2b6e6b61-eb34-46d9-ba1c-ae22913273fb',
    },
  };

  describe('Reset Modem', () => {
    it('should success to insert data modem to db', async() => {
      const db = {
        insertOne: sinon.stub().resolves(queryResult),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.insertOneModem({});
      assert.equal(res.data.indihomeNumber, queryResult.data.indihomeNumber);
    });
  });

  describe('Upsert data modem', () => {
    it('should success upsert data modem to db', async() => {
      const db = {
        upsertOne: sinon.stub().resolves(queryResult.data.indihomeNumber, '2020-07017'),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.upsertOneModem({});
      assert.equal(res, queryResult.data.indihomeNumber);
    });
  });
});
