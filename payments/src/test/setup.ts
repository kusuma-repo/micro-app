import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';
let mongodb: any;

declare global {
  namespace NodeJS {
    interface Global {
      signin(userId?: string): string[];
    }
  }
}
jest.mock('../nats.wrapper');
process.env.STRIPE_KEY =
  'sk_test_51Hd6VDDxAX8ghbPPbNUXilJmRtnBUul7tpfmyr1CxDg5odLOyx18AwrqcJxUnWDCwswoDzFOYFXAAzkA1uMNmFBq00icMOy5Yu';
beforeAll(async () => {
  process.env.JWT_KEY = 'mabahman313';
  mongodb = new MongoMemoryServer();
  const mongoUri = await mongodb.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongodb.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  /*
    build A Jwt Payload {id,email}
  */
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'testme@gmail.com',
  };
  /*
    create the JWT
  */
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  /*
    build  SESSION Object {jwt:my_jwt}
  */
  const session = { jwt: token };

  /*
    turn Session into JSON
  */
  const sessionJSON = JSON.stringify(session);
  /*
    Take JSON AND Encode it as base 64
  */
  const base64 = Buffer.from(sessionJSON).toString('base64');
  /*
    return a string thats the  cookie with encode data
  */
  return [`express:sess=${base64}`];
};
