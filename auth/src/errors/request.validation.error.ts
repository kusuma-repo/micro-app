import { ValidationError } from 'express-validator';

export class RequsetValidationError extends Error {
  constructor(private errors: ValidationError[]) {
    super();

    // this code added becasuse extending a built in class
    Object.setPrototypeOf(this, RequsetValidationError.prototype);
  }
}
