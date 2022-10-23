const joi = require('joi');

const getFaq = joi.object({
  userId: joi.string().required(),
  questionId: joi.string().required()
});

const searchModel = joi.object({
  keyword: joi.string().optional().allow(''),
  lang: joi.string().valid(['id','en']).required()
});

const searchAnswerModel = joi.object({
  keyword: joi.string().optional().allow('')
});

const checkIsolirBody = () => {
  return {
    checkND: {
      I_MSISDN: '',
      PV_COPER: ''
    }
  };
};

const messageIsolir = () => {
  return {
    titleID: 'Maaf saat ini layanan Anda sedang terisolir',
    descriptionID: 'Agar dapat digunakan kembali, silahkan melakukan pemabayaran',
    titleEN: 'Sorry, your service is currently isolated',
    descriptionEN: 'In order to activate your service, please complete the payment'
  };
};

const messageOutstanding = () => {
  return {
    titleID: 'Anda belum melakukan pembayaran tagihan',
    descriptionID: 'Agar layanan dapat digunakan kembali silahkan melakukan pembayaran',
    titleEN: 'Sorry, you have an outstanding bill',
    descriptionEN: 'In order yo use your service, please complete the payment'
  };
};

const checkInquiryBody = () => {
  return {
    indihome_number: ''
  };
};

const responseResult = () => {
  return {
    indihomeNum: '',
    status: '',
    amount: 0,
    title: '',
    description:''
  };
};

module.exports = {
  getFaq,
  searchModel,
  searchAnswerModel,
  checkIsolirBody,
  checkInquiryBody,
  responseResult,
  messageIsolir,
  messageOutstanding
};
