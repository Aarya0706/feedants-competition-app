class ApiError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'ERROR'; // machine-readable code the client can switch on
  }
}

module.exports = ApiError;
