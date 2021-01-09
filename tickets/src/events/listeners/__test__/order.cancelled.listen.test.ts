import { OrderCancelledListener } from '../order.cancelled.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent, OrderStatus } from '@fks-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  /*
   create an instance of the listener
  */
  const listener = new OrderCancelledListener(natsWrapper.client);
  /*
   create and save ticket
  */
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'lp concert',
    price: 990,
    userId: 'nickd',
  });
  ticket.set({ orderId });
  await ticket.save();
  /*
   create the fake data event
  */
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, orderId, data, msg };
};
it('Updated the ticket,publishes an even and ack the message ', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updateTicket = await Ticket.findById(ticket.id);

  expect(updateTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
