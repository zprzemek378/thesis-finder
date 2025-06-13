"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Message.ts 
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    request: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Request",
        required: false
    },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Chat",
        required: false
    },
});
// Wiadomość jest przypisana do request lub chat
messageSchema.pre('validate', function (next) {
    if (!this.request && !this.chat) {
        this.invalidate('request', 'Wiadomość musi być przypisana do zgłoszenia (request) lub czatu (chat).', this.request);
        this.invalidate('chat', 'Wiadomość musi być przypisana do zgłoszenia (request) lub czatu (chat).', this.chat);
    }
    else if (this.request && this.chat) {
        this.invalidate('request', 'Wiadomość nie może być przypisana jednocześnie do zgłoszenia i czatu.', this.request);
        this.invalidate('chat', 'Wiadomość nie może być przypisana jednocześnie do zgłoszenia i czatu.', this.chat);
    }
    next();
});
const MessageModel = mongoose_1.default.model("Message", messageSchema);
exports.default = MessageModel;
