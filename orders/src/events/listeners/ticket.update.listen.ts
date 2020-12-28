import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@fks-ticketing/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue.groupname';

export class TicketUpdateListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error('ticket Not found');
    }
    const { title, price } = data;
    ticket.set({
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
