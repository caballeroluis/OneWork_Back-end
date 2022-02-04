class ErrorBDEntityNotFound extends Error {  
    constructor (status, ...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = status
    }
  
    statusCode() {
      return this.status
    }
}

class ErrorBDEntityFound extends Error {  
    constructor (status, ...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = status
    }
  
    statusCode() {
      return this.status
    }
}

class ValidationDataError extends Error {  
    constructor (status, ...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = status
    }
  
    statusCode() {
      return this.status
    }
}

class MultipleValidationDataError extends Error {  
    constructor (status, message, ...params) {
      super(...params)
      Error.captureStackTrace(this, this.constructor);
        
      this.name = this.constructor.name
      this.message = message
      this.status = status
    }
  
    statusCode() {
      return this.status
    }
}

class InsufficientPermisionError extends Error {  
  constructor (status, ...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name
    this.status = status
  }

  statusCode() {
    return this.status
  }
}

module.exports = {
  MultipleValidationDataError,
  InsufficientPermisionError,
  ErrorBDEntityNotFound,
  ErrorBDEntityFound,
  ValidationDataError
}