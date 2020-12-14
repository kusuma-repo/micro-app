import { CustomError } from './custom-error';

export class DatabaseConnectionsError extends CustomError {
  statusCode = 500;
  reason = 'Error Connecting To Database';
  constructor() {
    super('error connecting to db');

    Object.setPrototypeOf(this, DatabaseConnectionsError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
