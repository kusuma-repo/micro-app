import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@fks-ticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
