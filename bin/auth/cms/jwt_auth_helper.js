
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../infra/configs/global_config');
const wrapper = require('../../helpers/utils/wrapper');
const { ERROR } = require('../../helpers/http-status/status_code');
const { UnauthorizedError, ForbiddenError } = require('../../helpers/error');
const services = require('./services');

const getKey = keyPath => fs.readFileSync(keyPath, 'utf8');

const generateToken = async (payload) => {
  const privateKey = getKey(config.get('/privateKey'));
  const verifyOptions = {
    algorithm: 'RS256',
    audience: '97b33193-43ff-4e58-9124-b3a9b9f72c34',
    issuer: 'telkomdev',
    expiresIn: '100m'
  };
  const token = jwt.sign(payload, privateKey, verifyOptions);
  return token;
};

const getToken = (headers) => {
  if (headers && headers.authorization && headers.authorization.includes('Bearer')) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
  }
  return undefined;
};

const verifyToken = async (req, res, next) => {
  const result = {
    err: null,
    data: null
  };
  const publicKey = fs.readFileSync(config.get('/publicKey'), 'utf8');
  const verifyOptions = {
    algorithm: 'RS256',
    audience: '97b33193-43ff-4e58-9124-b3a9b9f72c34',
    issuer: 'telkomdev'
  };

  const token = getToken(req.headers);
  if (!token) {
    result.err = new ForbiddenError('Invalid token!');
    return wrapper.response(res, 'fail', result, 'Invalid token!', ERROR.FORBIDDEN);
  }
  try {
    await jwt.verify(token, publicKey, verifyOptions);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      result.err = new UnauthorizedError('Access token expired!');
      return wrapper.response(res, 'fail', result, 'Access token expired!', ERROR.UNAUTHORIZED);
    }
    result.err = new UnauthorizedError('Token is not valid!');
    return wrapper.response(res, 'fail', result, 'Token is not valid!', ERROR.UNAUTHORIZED);
  }
  const user = await services.getCurrentUser({token: token});
  if (user.err) {
    result.err = new ForbiddenError('Invalid token!');
    return wrapper.response(res, 'fail', result, 'Invalid token!', ERROR.FORBIDDEN);
  }
  const { data } = user;
  if(!data){
    result.err = new ForbiddenError('Invalid token!');
    return wrapper.response(res, 'fail', result, 'Invalid token!', ERROR.FORBIDDEN);
  }
  const dataUser = {
    userId: data.userId,
    fullName: data.fullname,
    email: data.email,
    mobileNumber: data.mobile
  };
  req.user = dataUser;
  next();
};

module.exports = {
  generateToken,
  verifyToken
};
