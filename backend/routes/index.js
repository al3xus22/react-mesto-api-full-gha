const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/not-found-err');
const { createUser, login, logOut } = require('../controllers/users');
const { validateUserInfo, validateAuthorize } = require('../middlewares/validators');

router.post('/signup', validateUserInfo, createUser);
router.post('/signin', validateAuthorize, login);
router.get('/signout', logOut);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такоой страницы не существует'));
});

module.exports = router;
