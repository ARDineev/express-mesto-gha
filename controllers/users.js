const User = require('../models/user');

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: `Ошибка при создании пользователя: ${err}` });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: `Ошибка при получении списка пользователей: ${err}` });
  }
};

module.exports.getUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send({ message: `Ошибка при получении пользователя: ${err}` });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: `Ошибка при обновлении данных пользователя: ${err}` });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: `Ошибка при обновлении данных пользователя: ${err}` });
  }
};
