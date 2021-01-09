import express, { Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  validateRequest,
  requireAuth,
  NotAuthorized,
  NotFoundError,
  OrderStatus,
} from '@fks-ticketing/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publisher/payment.created.publish';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats.wrapper';
const routes = express.Router();

routes.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new NotFoundError());
    }
    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorized());
    }
    if (order.status === OrderStatus.Canceled) {
      return next(new BadRequestError('cannot pay for  cancelled order'));
    }
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order!.price * 100,
      source: token,
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ success: true });
  }
);

export { routes as createChargeRouter };
