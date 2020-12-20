import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@fks-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
