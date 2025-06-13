"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@maindb.d7gya1z.mongodb.net/maindb?retryWrites=true&w=majority&appName=MainDB`;
async function startServer() {
    try {
        console.log("Starting server...");
        await mongoose_1.default.connect(uri);
        console.log("✅ Connected to MongoDB with Mongoose");
        const PORT = process.env.PORT || 3000;
        const HOST = process.env.HOST || 'localhost';
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    }
}
startServer();
