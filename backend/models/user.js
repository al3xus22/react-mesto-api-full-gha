const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const BadRequest = require('../errors/bad-request');
const NotAuthorized = require('../errors/not-auth');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minLength: [2, 'Минимальная длина поля "name" - 2'],
      maxLength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minLength: [2, 'Минимальная длина поля "name" - 2'],
      maxLength: [30, 'Максимальная длина поля "name" - 30'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный email',
      },
      required: [true, 'Введите email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Введите пароль'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthorized('Неправильные почта или пароль 1')); //для отслеживания при разработке
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthorized('Неправильные почта или пароль 2'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
