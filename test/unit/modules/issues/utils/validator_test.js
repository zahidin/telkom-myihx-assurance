const { expect } = require('chai');
const validator = require('../../../../../bin/modules/issues/utils/validator');

describe('Utils validator test', () => {
  it('should handle right model', () => {
    let result = validator.isValidPayload({username: 'miralagustian', password: 'telkom2020', isActive: true}, validator.isValidPayload);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.be.null;
  });
});
