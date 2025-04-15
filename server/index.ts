require('dotenv').config();
import app from "./src/app";

import { MongoClient, ServerApiVersion } from "mongodb";


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@maindb.d7gya1z.mongodb.net/?appName=MainDB`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Testowe połączenie do bazy
async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

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