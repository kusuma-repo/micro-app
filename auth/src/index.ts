import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/Current-user';
import { signInRouter } from './routes/Signin';
import { signOutRouter } from './routes/Signout';
import { signUpRouter } from './routes/Signup';
import { errorHandler } from './middlewares/error-handler';
const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening port 3000 oke');
});
