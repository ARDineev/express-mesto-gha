const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  NOT_FOUND_CODE, SERVER_ERROR_CODE, BAD_REQUEST_CODE, CONFLICT_CODE, UNAUTHORIZED_CODE,
} = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true, // новый MongoDB-парсер
  useUnifiedTopology: true, // новый движок MongoDB
  family: 4, // версия IP для подключения
});

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[\w-.]+\.([a-z]{2,6})[/\w\-._~:/?#[\]@!$&'()*+,;=]*#?\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('/', (req, res) => res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый адрес не найден' }));
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR_CODE, message } = err;
  if (err.name === 'JsonWebTokenError') return res.status(UNAUTHORIZED_CODE).send({ message: err.message });
  if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: err.message });
  if (err.name === 'CastError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
  if (err.code === 11000) return res.status(CONFLICT_CODE).send({ message: 'Пользователь с таким email уже существует' });
  return res.status(statusCode).send({ message: statusCode === SERVER_ERROR_CODE ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT);
