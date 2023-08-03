const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotAuthorized = require('../errors/not-auth');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new NotAuthorized('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = auth;
