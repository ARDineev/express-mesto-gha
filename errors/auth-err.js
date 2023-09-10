const { UNAUTHORIZED_CODE } = require('../utils/constants');

class AuthentificationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_CODE;
  }
}

module.exports = AuthentificationError;
