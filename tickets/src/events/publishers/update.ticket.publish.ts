import { Publisher, Subjects, TicketUpdatedEvent } from '@fks-ticketing/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
