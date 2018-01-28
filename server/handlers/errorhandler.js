class ErrorWithStatusCode extends Error {
    constructor(status, message, err) {
        super(message);
        this.status = status;
        this.error = err;
    }
}

export {ErrorWithStatusCode};