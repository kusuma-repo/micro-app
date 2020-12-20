export enum OrderStatus {
  /*
   - When the order has been created, but the
   - ticket it is trying to order has not been reserved
  */
  Created = 'created',
  /*
   - The ticket the order is trying to reserve has already
  */
  Canceled = 'canceled',
  /*
   - The order has successfully reserved the ticket
  */
  awaitingPayment = 'awaiting:paymenet',
  /*
   - The order has reserved the ticket and the user has
  */
  Complete = 'complete',
}
