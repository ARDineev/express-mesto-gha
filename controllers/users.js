const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED_CODE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const EmptyFieldsError = require('../errors/empty-fields-err');
const AuthentificationError = require('../errors/auth-err');

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new EmptyFieldsError('Поля email и password являются обязательными');
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CREATED_CODE).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new EmptyFieldsError('Необходимо заполнить поля email и password');
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthentificationError('Неудача аутентификации. Проверьте поля email и password');
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new AuthentificationError('Неудача аутентификации. Проверьте поля email и password');
    }
    const payload = { _id: user._id };
    const token = JWT.sign(payload, 'SECRET_KEY', { expiresIn: '7d' });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};
