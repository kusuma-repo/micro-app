import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate.request';

import { BadRequestError } from '../errors/bad.request.error';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new BadRequestError('Email in use'));
    }
    const createUser = User.build({ email, password });
    await createUser.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: createUser.id,
        email: createUser.email,
      },
      process.env.JWT_KEY!
    );
    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(createUser);
  }
);

export { router as signUpRouter };
