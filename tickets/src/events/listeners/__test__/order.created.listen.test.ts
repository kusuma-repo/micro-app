import { OrderCreatedListener } from '../order.created.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@fks-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  /*
   create an instance of the listener
  */
  const listener = new OrderCreatedListener(natsWrapper.client);
  /*
   create and save ticket
  */
  const ticket = Ticket.build({
    title: 'lp concert',
    price: 990,
    userId: 'nickd',
  });
  await ticket.save();
  /*
   create the fake data event
  */
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asfsaa',
    expiresAt: 'asfasfsaf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};
it('sets the usersId of the ticket ', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updateTicket = await Ticket.findById(ticket.id);
  expect(updateTicket!.orderId).toEqual(data.id);
});
it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
it('its publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
