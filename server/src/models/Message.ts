// src/models/Message.ts
import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
    author: mongoose.Types.ObjectId;
    content: string;
    date: Date;
    request: mongoose.Types.ObjectId;                   // dodana referencja do Request jak mi zostalo powiedziane
}

const messageSchema = new mongoose.Schema<IMessage>({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    request: { // Reference to the Request this message belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
        required: true
    },
});

export default mongoose.model<IMessage>("Message", messageSchema);