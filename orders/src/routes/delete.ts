import express, { Request, Response, NextFunction } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorized,
} from '@fks-ticketing/common';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats.wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order.canceled.publish';
const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      return next(new NotFoundError());
    }
    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorized());
    }
    order.status = OrderStatus.Canceled;
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
