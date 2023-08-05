const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const ConflictRequest = require('../errors/conflict-request');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
      }).send({ email: user.email, _id: user._id, name: user.name, about: user.about, avatar: user.avatar });
    })
    .catch(next);
};

const logOut = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
  res.end();
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный Id пользователя'));
      } else {
        next(err);
      }
    });
};

const getAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10, (hash) => User.findOne({ email })
    .then(() => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => {
      res.status(201).send({
        email: data.email, name: data.name, about: data.about, avatar: data.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else if (err.code === 11000) {
        next(new ConflictRequest('Такой пользователь уже существует!'));
      } else {
        next(err);
      }
    })
    .catch((error) => {
      next(error);
    }));
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Что-то пошло не так'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  return updateUser(req, res, next);
};

module.exports = {
  createUser, getUsers, getUser, updateUser, updateUserAvatar, login, logOut, getAuthUser,
};
