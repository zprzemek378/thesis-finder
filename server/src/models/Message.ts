// src/models/Message.ts
import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
    author: mongoose.Types.ObjectId;
    content: string;
    date: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Student", messageSchema);