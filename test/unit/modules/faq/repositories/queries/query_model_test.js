const assert = require('assert');
const { expect } = require('chai');
const faq = require('../../../../../../bin/modules/faq/repositories/queries/query_model');
const validator = require('../../../../../../bin/helpers/utils/validator');

describe('FAQ Query model test', () => {
  it('should handle right model getFaq', () => {
    let result = validator.isValidPayload({userId:'c94e6b80-8f6d-44be-af4b-bd5c3c99d340',
      questionId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'}, faq.getFaq);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['userId','questionId']);
    expect(result.err).to.be.null;
  });
  it('should handle wrong model FAQ Id', () => {
    let result = validator.isValidPayload({userId:'c94e6b80-8f6d-44be-af4b-bd5c3c99d340', questionId:''}, faq.getFaq);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.err).to.have.keys(['message', 'code']);
    expect(result.err.message).to.equal('"questionId" is not allowed to be empty');
    expect(result.err.code).to.equal(400);
  });
  it('should handle right model getFaq', () => {
    let result = validator.isValidPayload({userId:'c94e6b80-8f6d-44be-af4b-bd5c3c99d340',
      questionId:'6460a229-3ce7-4c6a-bc2d-252e1f88ade3'}, faq.getFaq);
    expect(result).to.have.keys(['err', 'data']);
    expect(result.data).to.have.keys(['userId','questionId']);
    expect(result.err).to.be.null;
  });
  it('should return checkIsolirBody', async() => {
    const result = await faq.checkIsolirBody('');
    assert.equal(result.checkND.I_MSISDN, '');
  });
  it('should return messageIsolir', async() => {
    const result = await faq.messageIsolir('');
    assert.equal(result.titleID, 'Maaf saat ini layanan Anda sedang terisolir');
  });
  it('should return messageOutstanding', async() => {
    const result = await faq.messageOutstanding('');
    assert.equal(result.titleID, 'Anda belum melakukan pembayaran tagihan');
  });
  it('should return checkInquiryBody', async() => {
    const result = await faq.checkInquiryBody('');
    assert.equal(result.indihome_number, '');
  });
  it('should return responseResult', async() => {
    const result = await faq.responseResult('');
    assert.equal(result.amount, 0);
  });
});
