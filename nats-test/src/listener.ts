import nats from 'node-nats-streaming';
import cryptoRandomString from 'crypto-random-string';
import { TicketCreatedListener } from './events/ticket.created.listen';

console.clear();

const stan = nats.connect('ticketing', cryptoRandomString({ length: 10 }), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  new TicketCreatedListener(stan).listen();
});
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
