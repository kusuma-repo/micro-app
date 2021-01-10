import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderStatus,
} from '@fks-ticketing/common';
import { queueGroupName } from './queueGroupname';
import { Order } from '../../models/order';
import { Message } from 'node-nats-streaming';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      return new Error('Orders not found');
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();
    msg.ack();
  }
}
