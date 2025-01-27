import mongoose from 'mongoose';
import { DB_URI } from '../config/env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Salir del proceso si no se puede conectar
  }
};

export default connectDB;
