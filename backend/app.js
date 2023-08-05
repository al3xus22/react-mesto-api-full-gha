const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const serverError = require('./errors/server-error');
const router = require('./routes');

const { PORT = 3001, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL);

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use(serverError);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
