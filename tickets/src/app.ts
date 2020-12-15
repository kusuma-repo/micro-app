import express from 'express';
import { json } from 'body-parser';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@fks-ticketing/common';
import cookieSession from 'cookie-session';
import { createTicketsRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';
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
app.use(currentUser);
app.use(createTicketsRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(errorHandler);
app.use(updateTicketRouter);
app.all('*', async () => {
  throw new NotFoundError();
});

export { app };
