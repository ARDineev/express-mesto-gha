const { BAD_REQUEST_CODE } = require('../utils/constants');

class EmptyFieldsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_CODE;
  }
}

module.exports = EmptyFieldsError;
