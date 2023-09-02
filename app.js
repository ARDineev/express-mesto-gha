const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND_CODE } = require('./utils/constants');

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
app.use((req, res, next) => {
  req.user = {
    _id: '64ef7d413dd70b509711ea40',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', (req, res) => res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый адрес не найден' }));

app.listen(PORT);
