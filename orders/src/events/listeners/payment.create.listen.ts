import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
} from '@fks-ticketing/common';

import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue.groupname';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentsCreated = Subjects.PaymentsCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order Not found');
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    msg.ack();
  }
}
