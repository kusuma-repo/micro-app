import express, { Response, Request, NextFunction } from 'express';
import { NotFoundError } from '@fks-ticketing/common';

import { Ticket } from '../models/tickets';
const router = express.Router();

router.get(
  '/api/tickets/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new NotFoundError());
    }
    res.send(ticket);
  }
);

export { router as showTicketRouter };
