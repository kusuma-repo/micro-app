import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/Current-user';
import { signInRouter } from './routes/Signin';
import { signOutRouter } from './routes/Signout';
import { signUpRouter } from './routes/Signup';
const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.listen(3000, () => {
  console.log('Listening port 3000 oke');
});
