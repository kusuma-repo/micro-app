import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { RequsetValidationError } from '../errors/request.validation.error';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequsetValidationError(errors.array());
  }
  next();
};
