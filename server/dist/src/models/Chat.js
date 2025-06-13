"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Chat.ts
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
    title: { type: String, required: false },
    lastMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
        required: false
    },
    lastMessageDate: { type: Date, required: false }
    // ,readStatuses: [readStatusSchema]
}, { timestamps: true });
const ChatModel = mongoose_1.default.model("Chat", chatSchema);
exports.default = ChatModel;
