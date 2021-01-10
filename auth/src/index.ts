import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('waiting app to starting up...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('JWT_KEY must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('success conected to mongoDb');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('Listening port 3000 oke');
  });
};

start();
