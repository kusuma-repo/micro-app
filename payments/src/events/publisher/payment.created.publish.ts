import {
  Subjects,
  PaymentCreatedEvent,
  Publisher,
} from '@fks-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentsCreated = Subjects.PaymentsCreated;
}
