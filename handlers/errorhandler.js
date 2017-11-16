class ErrorWithStatusCode extends Error {
  constructor(code, message, err) {
    super(message);
    this.code = code;
    this.error = err;
  }
}

export {ErrorWithStatusCode}