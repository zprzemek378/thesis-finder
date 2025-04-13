import mongoose from 'mongoose';

export interface IChat extends mongoose.Document {
  title: string;
  messages: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
}

const chatSchema = new mongoose.Schema<IChat>({
    title: { type: String, required: true },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }],
});

export default mongoose.model<IChat>("Student", chatSchema);