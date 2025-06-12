// src/models/Chat.ts
import mongoose from 'mongoose';
import { IMessage } from './Message';

// interface IReadStatus {                                  // Interfejs statusu przeczytania
//     userId: mongoose.Types.ObjectId;
//     lastReadMessage: mongoose.Types.ObjectId;            // Referencja do ID ostatniej przeczytanej wiadomości
//     lastReadDate: Date;                                  // Data i czas, kiedy ostatnia wiadomość została przeczytana przez tego użytkownika
// }

export interface IChat extends mongoose.Document {
    members: mongoose.Types.ObjectId[];                     // Uczestnicy czatu 
    title?: string;                                         // Tytuł czatu 
    lastMessage?: mongoose.Types.ObjectId | IMessage;      // Referencja do ostatniej wiadomości w czacie
    lastMessageDate?: Date; 
    // readStatuses: IReadStatus[];             // Jak chcecie to tablica statusów przeczytania, ale od was zalezy 
}

const chatSchema = new mongoose.Schema<IChat>({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    }],
    title: { type: String, required: false },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", 
        required: false
    },
    lastMessageDate: { type: Date, required: false }
    // ,readStatuses: [readStatusSchema]
}, { timestamps: true }); 

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);
export default ChatModel;