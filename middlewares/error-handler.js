const {
  SERVER_ERROR_CODE, BAD_REQUEST_CODE, CONFLICT_CODE, UNAUTHORIZED_CODE,
} = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR_CODE, message } = err;
  if (err.name === 'JsonWebTokenError') return res.status(UNAUTHORIZED_CODE).send({ message: err.message });
  if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: err.message });
  if (err.name === 'CastError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
  if (err.code === 11000) return res.status(CONFLICT_CODE).send({ message: 'Пользователь с таким email уже существует' });
  return res.status(statusCode).send({ message: statusCode === SERVER_ERROR_CODE ? 'На сервере произошла ошибка' : message });
};

module.exports = errorHandler;
