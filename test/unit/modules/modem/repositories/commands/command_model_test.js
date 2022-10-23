const { expect } = require('chai');
const modem = require('../../../../../../bin/modules/modem/repositories/commands/command_model');
const validator = require('../../../../../../bin/helpers/utils/validator');

describe('Login modem model test', () => {
  it('should handle right model', () => {
    let result = validator.isValidPayload({username: 'miralagustian', password: 'telkom2020', isActive: true}, modem.login);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['username', 'password', 'isActive']);
    expect(result.err).to.be.null;
  });

  it('should handle wrong model', () => {
    let result = validator.isValidPayload({username: '', password: 'telkom2020', isActive: true}, modem.login);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('"username" is not allowed to be empty');
    expect(result.err.code).to.equal(400);

    result = validator.isValidPayload({username: 'miralagustian', password: '', isActive: true}, modem.login);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('"password" is not allowed to be empty');
    expect(result.err.code).to.equal(400);
  });
});
