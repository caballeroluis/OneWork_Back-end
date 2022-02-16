class ErrorBDEntityNotFound extends Error {  
    constructor (...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name;
      this.status = 404;
    }
  
    statusCode() {
      return this.status;
    }
}

class ErrorPwdOrUserNotFound extends Error {  
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 404;
  }

  statusCode() {
    return this.status;
  }
}

class OfferStatusError extends Error {  
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 400;
  }

  statusCode() {
    return this.status;
  }
}

class ErrorBDEntityFound extends Error {  
    constructor (...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 400;
    }
  
    statusCode() {
      return this.status;
    }
}

class ValidationDataError extends Error {  
    constructor (...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name;
      this.status = 400;
    }
  
    statusCode() {
      return this.status;
    }
}

class MultipleValidationDataError extends Error {  
    constructor (...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
        
      this.name = this.constructor.name;
      this.status = 400;
    }
  
    statusCode() {
      return this.status
    }
}

class InsufficientPermisionError extends Error {  
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 403;
  }

  statusCode() {
    return this.status;
  }
}

class UnathorizedError extends Error {  
  constructor (status, ...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 401;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = {
  MultipleValidationDataError,
  InsufficientPermisionError,
  OfferStatusError,
  UnathorizedError,
  ErrorPwdOrUserNotFound,
  ErrorBDEntityNotFound,
  ErrorBDEntityFound,
  ValidationDataError
}