const assert = require('assert');
const sinon = require('sinon');
const Command = require('../../../../../../bin/modules/issues/repositories/commands/command');

describe('Issue-command', () => {
  const queryResult = {
    'err': null,
    'data': {
      '_id': '5ee85d46ce6fd650c86016fd',
      'issueId': 'MYINX-15916671112341',
      'assetNum': '50014277_131184115030_INTERNET',
      'psbAccount':
        {
          'indihomeNumber': '131184115030',
          'ncli': '50014277',
          'telephoneNumber': '02154520122'
        },
      'userId': '9fa0cd72-ea4a-4dda-aef4-3078392e43a3',
      'symptom':
        {
          'symptomId': 'b8f83073-092e-4473-ab47-a3df613907f5',
          'clasificationId': 'A_INTERNET //// A_INTERNET_001 //// A_INTERNET_001_003 //// A_INTERNET_001_003_003',
          'isFiber': 'Fiber',
          'iBooster': {}
        },
      'issueType': 'INTERNET',
      'ticketType': 'Fisik',
      'message': 'Internet dan tv mati nih, kenapa sih indihome begini mulu, sebel ekye',
      'status': 'close',
      'schedule':
        {
          'bookingId': '1592286844074_6',
          'scheduleAttempt': 0,
          'timeBox': '2020-09-11T02:33:31.078+00:00',
          'timeSlot': [Object],
          'availability': 1,
          'crewId': 'A2BIN010',
          'information': 'Crew pada STO terdekat',
          'contactSecondary': null
        },
      'createdAt': '2020-06-16T05:48:54.982Z',
      'lastModified': '2020-06-16T05:55:09.963Z',
      'work': 'ASSIGNED',
      'comments': [
        {
          'comment': 'Test pertama',
          'createdAt': '2020-07-06T04:07:21.796+00:00'
        },
        {
          'comment': 'Test kedua',
          'createdAt': '2020-07-06T04:07:21.796+00:00'
        },
        {
          'comment': 'Test Ketiga',
          'createdAt': '2020-07-06T04:07:21.796+00:00'
        }
      ],
      'ticketId': 'IN123456',
      'technician': {
        'personId':'TAW2JAKSEL_103',
        'displayName':'JUFRIYANTO',
        'email':'jufryanto@gmail.com',
        'phone':'081285399618'
      }
    }
  };

  describe('Insert Issues', () => {
    it('should success to insert data issue to db', async() => {
      const db = {
        insertOne: sinon.stub().resolves(queryResult),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.insertIssue({});
      assert.equal(res.data.issueId, queryResult.data.issueId);
    });
  });

  describe('Upsert Issues', () => {
    it('should success to Upsert Issues to db', async() => {
      const db = {
        upsertOne: sinon.stub().resolves('MYINX-15916671112341', queryResult),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.upsertIssues({});
      assert.equal(res, queryResult.data.issueId);
    });
  });

  describe('Insert Comment', () => {
    it('should success to insert data comment to db', async() => {
      const db = {
        insertOne: sinon.stub().resolves(queryResult),
        setCollection: sinon.stub()
      };
      const command = new Command(db);
      const res = await command.insertComment({});
      assert.equal(res.data.issueId, queryResult.data.issueId);
    });
  });

});
