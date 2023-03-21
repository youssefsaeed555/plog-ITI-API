//This class is responsible about errors i can predict
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith(4) ? "fail" : "error";
  }
}

module.exports = ApiError;
