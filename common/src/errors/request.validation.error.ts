import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export class RequsetValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Error request body');

    // this code added becasuse extending a built in class
    Object.setPrototypeOf(this, RequsetValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
