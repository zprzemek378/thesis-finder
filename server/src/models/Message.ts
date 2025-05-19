import mongoose from 'mongoose';

export interface Imessage extends mongoose.Document {
    author: mongoose.Types.ObjectId;
    content: string;
    date: Date;
}

const messageSchema = new mongoose.Schema<Imessage>({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model<Imessage>("Student", messageSchema);