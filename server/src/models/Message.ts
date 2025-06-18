// src/models/Message.ts 
import mongoose from 'mongoose';
import { IUser } from './User';

export interface IMessage extends mongoose.Document {
    author: mongoose.Types.ObjectId | IUser;
    content: string;
    date: Date;
    request?: mongoose.Types.ObjectId; 
    chat?: mongoose.Types.ObjectId;    
}

const messageSchema = new mongoose.Schema<IMessage>({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    request: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
        required: false 
    },
    chat: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat", 
        required: false 
    },
});

// Wiadomość jest przypisana do request lub chat
messageSchema.pre('validate', function (next) {
    if (!this.request && !this.chat) {
        this.invalidate('request', 'Wiadomość musi być przypisana do zgłoszenia (request) lub czatu (chat).', this.request);
        this.invalidate('chat', 'Wiadomość musi być przypisana do zgłoszenia (request) lub czatu (chat).', this.chat);
    } else if (this.request && this.chat) {
        this.invalidate('request', 'Wiadomość nie może być przypisana jednocześnie do zgłoszenia i czatu.', this.request);
        this.invalidate('chat', 'Wiadomość nie może być przypisana jednocześnie do zgłoszenia i czatu.', this.chat);
    }
    next();
});

const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
export default MessageModel;