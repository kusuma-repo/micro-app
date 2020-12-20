import express, { Response, Request, NextFunction } from 'express';
import {
  requireAuth,
  NotAuthorized,
  NotFoundError,
} from '@fks-ticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      return next(new NotFoundError());
    }
    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorized());
    }
    res.send(order);
  }
);

export { router as showOrderRouter };
