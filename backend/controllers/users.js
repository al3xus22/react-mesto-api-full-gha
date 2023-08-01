// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const ConflictRequest = require('../errors/conflict-request');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) next(new BadRequest('Email или пароль не могут быть пустыми'));
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }).send({ token });
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
    .orFail(new Error('InvalidUserId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'InvalidUserId') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.name === 'CastError') {
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
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный Id пользователя'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10, (err, hash) => User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictRequest('Пользователь с таким Email уже существует');
      }
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((data) => {
          res.status(201).send({
            email: data.email,
            name: data.name,
            about: data.about,
            avatar: data.avatar,
          });
        })
        // eslint-disable-next-line no-shadow
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest(err.message));
          } else {
            next(err);
          }
        });
    })
    .catch((error) => {
      next(error);
    })
  )
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Что-то пошло не так'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Некорректный Id пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  if (!req.body.avatar) {
    return new BadRequest('Поле avatar не заполнено');
  }
  return updateUser(req, res, next);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  login,
  logOut,
  getAuthUser,
};
