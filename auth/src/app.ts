import express from 'express';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@fks-ticketing/common';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/Current-user';
import { signInRouter } from './routes/Signin';
import { signOutRouter } from './routes/Signout';
import { signUpRouter } from './routes/Signup';

import 'express-async-errors';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(errorHandler);
app.all('*', async () => {
  throw new NotFoundError();
});

export { app };
