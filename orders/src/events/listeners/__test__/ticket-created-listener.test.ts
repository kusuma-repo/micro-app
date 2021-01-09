import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@fks-ticketing/common';
import { TicketCreatedListener } from '../ticket.created.listen';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  /*
    Create an isntances of the listener
  */
  const listener = new TicketCreatedListener(natsWrapper.client);

  /*
    Create a fake data event
  */
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'spongebob movie',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  /*
    Create a fake Object 
  */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};
it('creates and saves a ticket ', async () => {
  const { listener, data, msg } = await setup();
  /*
    call the onMessage function with the data object + message object
  */
  await listener.onMessage(data, msg);
  /*
    write assertions to make sure a ticket was created!
  */
  const ticket = await Ticket.findById(data.id);
  expect(ticket);
});

it('ack the message ', async () => {
  const { listener, data, msg } = await setup();
  /*
    call the onMessage function with the data object + message object
   */
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
