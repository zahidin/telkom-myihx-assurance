const wrapper = require('../../../helpers/utils/wrapper');
const commandHandler = require('../repositories/commands/command_handler');
const { ERROR:httpError, SUCCESS:http } = require('../../../helpers/http-status/status_code');

const resetModem = async (req, res) => {
  const { userId } = req;
  const getData = async () => commandHandler.resetModem(userId);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Reset Modem', httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, 'Reset Modem', http.OK);
  };
  sendResponse(await getData());
};

module.exports = {
  resetModem
};
