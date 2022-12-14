const joi = require('joi');

const login = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  isActive : joi.boolean().default(true, 'Example If Need Default Value')
});

const modem = () => {
  const model = {
    indihomeNumber: '',
    userId: '',
    rebootTime: new Date(),
    createdAt: new Date()
  };
  return model;
};

module.exports = {
  login,
  modem
};
