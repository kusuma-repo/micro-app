import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@fks-ticketing/common';
import { TicketUpdateListener } from '../ticket.update.listen';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  /*
    Create an isntances of the listener
  */
  const listener = new TicketUpdateListener(natsWrapper.client);

  /*
    Create a fake data event
  */
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'spongebob movie',
    price: 20,
  });
  await ticket.save();
  /*
    Create a fake data object
   */
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new spongebo movie',
    price: 90,
    userId: 'adasasafa4848',
  };
  /*
    Create a fake Object 
  */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket };
};
it('finds,update , and saves a ticket', async () => {
  const { listener, msg, data, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updateTicket = await Ticket.findById(ticket.id);
  expect(updateTicket!.title).toEqual(data.title);
  expect(updateTicket!.price).toEqual(data.price);
  expect(updateTicket!.version).toEqual(data.version);
});

it('ack the message  ', async () => {
  const { listener, msg, data } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
