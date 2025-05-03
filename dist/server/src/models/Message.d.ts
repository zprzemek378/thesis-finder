import mongoose from 'mongoose';
export interface Imessage extends mongoose.Document {
    author: mongoose.Types.ObjectId;
    content: string;
    date: Date;
}
declare const _default: mongoose.Model<Imessage, {}, {}, {}, mongoose.Document<unknown, {}, Imessage> & Imessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
