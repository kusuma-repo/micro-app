import { Listener, OrderCreatedEvent, Subjects } from '@fks-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';
import { TicketUpdatePublisher } from '../publishers/update.ticket.publish';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = 'tickets-service';

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    /*
      FInd the ticket that order is reservation
    */
    const ticket = await Ticket.findById(data.ticket.id);
    /*
      if no ticket throw error
    */
    if (!ticket) {
      throw new Error('Ticket Not Found');
    }
    /*
      mark the tickets as being reserved by setting its orderId property
    */
    ticket.set({ orderId: data.id });
    /*
      Save the ticket
    */
    await ticket.save();
    await new TicketUpdatePublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    /*
      ack the message
    */
    msg.ack();
  }
}
