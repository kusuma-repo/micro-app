import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { TicketUpdatePublisher } from '../events/publishers/update.ticket.publish';
import { natsWrapper } from '../nats.wrapper';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorized,
  BadRequestError,
} from '@fks-ticketing/common';

import { Ticket } from '../models/tickets';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.findById(req.params.id);

    if (!tickets) {
      return next(new NotFoundError());
    }
    if (tickets.orderId) {
      return next(new BadRequestError('Cannot edit reserved ticket'));
    }
    if (tickets.userId !== req.currentUser!.id) {
      return next(new NotAuthorized());
    }

    tickets.set({
      title: req.body.title,
      price: req.body.price,
    });
    await tickets.save();
    await new TicketUpdatePublisher(natsWrapper.client).publish({
      id: tickets.id,
      title: tickets.title,
      price: tickets.price,
      userId: tickets.userId,
      version: tickets.version,
    });
    res.send(tickets);
  }
);

export { router as updateTicketRouter };
