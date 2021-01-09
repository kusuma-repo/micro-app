import { Listener, OrderCancelledEvent, Subjects } from '@fks-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatePublisher } from '../publishers/update.ticket.publish';
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = 'tickets-service';

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    /*
      FInd the ticket that order is reservation
    */
    console.log(data);
    const ticket = await Ticket.findById(data.ticket.id);
    /*
      if no ticket throw error
    */
    if (!ticket) {
      return new Error('Ticket Not Found');
    }
    /*
      mark the tickets as being reserved by setting its orderId property
    */
    ticket.set({ orderId: undefined });
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
