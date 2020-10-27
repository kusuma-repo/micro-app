export class DatabaseConnectionsError extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionsError.prototype);
  }
}
