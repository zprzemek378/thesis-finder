"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./src/app"));
const mongodb_1 = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@maindb.d7gya1z.mongodb.net/?appName=MainDB`;
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
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
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    }
}
startServer();
