// index.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';
import mongoose from 'mongoose';

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@maindb.d7gya1z.mongodb.net/maindb?retryWrites=true&w=majority&appName=MainDB`;

async function startServer() {
  try {
    console.log("Starting server...");
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB with Mongoose");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();
