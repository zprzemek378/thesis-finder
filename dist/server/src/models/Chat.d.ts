import mongoose from 'mongoose';
export interface IChat extends mongoose.Document {
    title: string;
    messages: mongoose.Types.ObjectId[];
    members: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat> & IChat & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
