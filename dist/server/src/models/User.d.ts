import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    faculty: string;
    role: "STUDENT" | "ADMIN" | "SUPERVISOR";
    student: mongoose.Types.ObjectId | null;
    supervisor: mongoose.Types.ObjectId | null;
    chats: mongoose.Types.ObjectId[] | null;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
