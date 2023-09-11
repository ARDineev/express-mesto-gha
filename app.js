const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { rateLimit } = require('express-rate-limit');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const errorHandler = require('./middlewares/error-handler');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { userLogInValidator, userCreateValidator } = require('./middlewares/validators');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // в течение 15 минут проверяются/запоминаются запросы
  max: 100, // Максимальное количество подключений в течение 15 минут до ограничений
  standardHeaders: 'draft-7', // в response установить комбинированный заголовок RateLimit
  // с информацией о лимите запросов, сколько осталось подключений и т.д.
  legacyHeaders: false, // не отправлять устаревшие заголовки с информацией об ограничениях
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true, // новый MongoDB-парсер
  useUnifiedTopology: true, // новый движок MongoDB
  family: 4, // версия IP для подключения
});

const app = express();

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', userLogInValidator, login);
app.post('/signup', userCreateValidator, createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый адрес не найден'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
