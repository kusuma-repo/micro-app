import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/Current-user';
import { signInRouter } from './routes/Signin';
import { signOutRouter } from './routes/Signout';
import { signUpRouter } from './routes/Signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
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
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('success conected to mongoDb');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('Listening port 3000 oke');
  });
};

start();
