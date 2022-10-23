const sinon = require('sinon');
const { expect } = require('chai');
const issueHandler = require('../../../../../bin/modules/issues/handlers/api_handler');
const queryHandler = require('../../../../../bin/modules/issues/repositories/queries/query_handler');
const commandHandler = require('../../../../../bin/modules/issues/repositories/commands/command_handler');
const validator = require('../../../../../bin/helpers/utils/common');

describe('Issues Api Handler', () => {

  let res;
  beforeEach(() => {
    res = {
      send: function () {
        return true;
      }
    };
  });

  const req = {
    body: {},
    params: {},
    query: {},
    authorization: {
      credentials:'xx'
    },
    headers: [
      'accept-language', 'id'
    ]
  };

  const resultSucces = {
    err: null,
    message:'success',
    data: [],
    code: 200
  };

  const resultError = {
    err: true
  };

  describe('getAllCategories', () => {
    it('should cover error validation', async () => {
      await issueHandler.getAllCategories(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler,'getCategories').resolves(resultError);
      expect(await issueHandler.getAllCategories(req, res));
      validator.isValidPayload.restore();
      queryHandler.getCategories.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler,'getCategories').resolves(resultSucces);
      expect(await issueHandler.getAllCategories(req, res));
      validator.isValidPayload.restore();
      queryHandler.getCategories.restore();
    });
  });

  describe('createTicket', () => {
    it('should cover error validation', async () => {
      await issueHandler.createTicket(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler,'createTicketIssue').resolves(resultError);
      expect(await issueHandler.createTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.createTicketIssue.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler,'createTicketIssue').resolves(resultSucces);
      expect(await issueHandler.createTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.createTicketIssue.restore();
    });
  });

  describe('postSchedule', () => {
    it('should cover error validation', async () => {
      await issueHandler.postSchedule(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler,'postScheduleIssue').resolves(resultError);
      expect(await issueHandler.postSchedule(req, res));
      validator.isValidPayload.restore();
      commandHandler.postScheduleIssue.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler,'postScheduleIssue').resolves(resultSucces);
      expect(await issueHandler.postSchedule(req, res));
      validator.isValidPayload.restore();
      commandHandler.postScheduleIssue.restore();
    });
  });

  describe('postReopenSchedule', () => {
    it('should cover error validation', async () => {
      await issueHandler.postReopenSchedule(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler,'postReopenSchedule').resolves(resultError);
      expect(await issueHandler.postReopenSchedule(req, res));
      validator.isValidPayload.restore();
      commandHandler.postReopenSchedule.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler,'postReopenSchedule').resolves(resultSucces);
      expect(await issueHandler.postReopenSchedule(req, res));
      validator.isValidPayload.restore();
      commandHandler.postReopenSchedule.restore();
    });
  });

  describe('Get Issue By Type', () => {
    it('should cover error validation', async () => {
      await issueHandler.getIssuesByType(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getIssuesByType').resolves(resultError);
      expect(await issueHandler.getIssuesByType(req, res));
      queryHandler.getIssuesByType.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getIssuesByType').resolves(resultSucces);
      expect(await issueHandler.getIssuesByType(req, res));
      queryHandler.getIssuesByType.restore();
    });
  });

  describe('Get Issue By Id', () => {
    it('should cover error validation', async () => {
      await issueHandler.getIssuesById(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getIssuesId').resolves(resultError);
      expect(await issueHandler.getIssuesById(req, res));
      queryHandler.getIssuesId.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getIssuesId').resolves(resultSucces);
      expect(await issueHandler.getIssuesById(req, res));
      queryHandler.getIssuesId.restore();
    });
  });

  describe('Schedule Availability', () => {
    it('should cover error validation', async () => {
      await issueHandler.scheduleAvailability(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getScheduleAvailability').resolves(resultError);
      expect(await issueHandler.scheduleAvailability(req, res));
      queryHandler.getScheduleAvailability.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getScheduleAvailability').resolves(resultSucces);
      expect(await issueHandler.scheduleAvailability(req, res));
      queryHandler.getScheduleAvailability.restore();
    });
  });

  describe('Get Ticket Details', () => {
    it('should cover error validation', async () => {
      await issueHandler.getTicketDetails(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'getTicketDetails').resolves(resultError);
      expect(await issueHandler.getTicketDetails(req, res));
      validator.isValidPayload.restore();
      queryHandler.getTicketDetails.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'getTicketDetails').resolves(resultSucces);
      expect(await issueHandler.getTicketDetails(req, res));
      validator.isValidPayload.restore();
      queryHandler.getTicketDetails.restore();
    });
  });

  describe('getRescheduleTicket', () => {
    it('should cover error validation', async () => {
      await issueHandler.getRescheduleTicket(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'rescheduleTicket').resolves(resultError);
      expect(await issueHandler.getRescheduleTicket(req, res));
      validator.isValidPayload.restore();
      queryHandler.rescheduleTicket.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(queryHandler, 'rescheduleTicket').resolves(resultSucces);
      expect(await issueHandler.getRescheduleTicket(req, res));
      validator.isValidPayload.restore();
      queryHandler.rescheduleTicket.restore();
    });
  });

  describe('rescheduleTicket', () => {
    it('should cover error validation', async () => {
      await issueHandler.rescheduleTicket(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'rescheduleTicket').resolves(resultError);
      expect(await issueHandler.rescheduleTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.rescheduleTicket.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'rescheduleTicket').resolves(resultSucces);
      expect(await issueHandler.rescheduleTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.rescheduleTicket.restore();
    });
  });

  describe('reopenTechnician', () => {
    it('should cover error validation', async () => {
      await issueHandler.reopenTechnician(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'reopenTechnician').resolves(resultError);
      expect(await issueHandler.reopenTechnician(req, res));
      queryHandler.reopenTechnician.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'reopenTechnician').resolves(resultSucces);
      expect(await issueHandler.reopenTechnician(req, res));
      queryHandler.reopenTechnician.restore();
    });
  });

  describe('updateTicketId', () => {
    it('should cover error validation', async () => {
      await issueHandler.updateTicketId(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateTicketId').resolves(resultError);
      expect(await issueHandler.updateTicketId(req, res));
      validator.isValidPayload.restore();
      commandHandler.updateTicketId.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateTicketId').resolves(resultSucces);
      expect(await issueHandler.updateTicketId(req, res));
      validator.isValidPayload.restore();
      commandHandler.updateTicketId.restore();
    });
  });

  describe('updateStatusTicket', () => {
    it('should cover error validation', async () => {
      await issueHandler.updateStatusTicket(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateStatusTicket').resolves(resultError);
      expect(await issueHandler.updateStatusTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.updateStatusTicket.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'updateStatusTicket').resolves(resultSucces);
      expect(await issueHandler.updateStatusTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.updateStatusTicket.restore();
    });
  });

  describe('reopenTicket', () => {
    it('should cover error validation', async () => {
      await issueHandler.reopenTicket(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'reopenTicket').resolves(resultError);
      expect(await issueHandler.reopenTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.reopenTicket.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'reopenTicket').resolves(resultSucces);
      expect(await issueHandler.reopenTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.reopenTicket.restore();
    });
  });

  describe('closeTicket', () => {
    it('should cover error validation', async () => {
      await issueHandler.closeTicket(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'closeTicket').resolves(resultError);
      expect(await issueHandler.closeTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.closeTicket.restore();
    });
    it('Should return success', async () => {
      sinon.stub(validator,'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'closeTicket').resolves(resultSucces);
      expect(await issueHandler.closeTicket(req, res));
      validator.isValidPayload.restore();
      commandHandler.closeTicket.restore();
    });
  });

  describe('Get Comments', () => {
    it('should cover error validation', async () => {
      await issueHandler.comment(req, res);
    });
    it('Should return error', async () => {
      sinon.stub(queryHandler, 'getCommentByIssueId').resolves(resultError);
      expect(await issueHandler.comment(req, res));
      queryHandler.getCommentByIssueId.restore();
    });
    it('Should return success', async () => {
      sinon.stub(queryHandler, 'getCommentByIssueId').resolves(resultSucces);
      expect(await issueHandler.comment(req, res));
      queryHandler.getCommentByIssueId.restore();
    });
  });

  describe('Add Comment', () => {
    it('should cover error validation', async () => {
      await issueHandler.addComment(req, res);
    });

    it('Should return error', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'addComment').resolves(resultError);
      expect(await issueHandler.addComment(req, res));
      validator.isValidPayload.restore();
      commandHandler.addComment.restore();
    });

    it('Should return success', async () => {
      sinon.stub(validator, 'isValidPayload').resolves({
        err: true,
        data: {}
      });
      sinon.stub(commandHandler, 'addComment').resolves(resultSucces);
      expect(await issueHandler.addComment(req, res));
      validator.isValidPayload.restore();
      commandHandler.addComment.restore();
    });
  });

});
