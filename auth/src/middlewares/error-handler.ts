import { Request, Response, NextFunction } from 'express';
import { RequsetValidationError } from '../errors/request.validation.error';
import { DatabaseConnectionsError } from '../errors/database.connection.error';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequsetValidationError) {
    console.log('handling error as requset validations');
  }
  if (err instanceof DatabaseConnectionsError) {
    console.log('handling error as database connections');
  }
  console.log('Something went wrong ', err);
  res.status(400).send({
    message: err.message,
  });
};
