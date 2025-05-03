import mongoose from 'mongoose';
export interface IThesis extends mongoose.Document {
    title: string;
    description: string;
    degree: string;
    faculty: string;
    supervisor: mongoose.Types.ObjectId;
    studentsLimit: number;
    students: mongoose.Types.ObjectId[];
    status: "FREE" | "IN_PROGRESS" | "TAKEN" | "FINISHED";
    tags: string[];
}
declare const _default: mongoose.Model<IThesis, {}, {}, {}, mongoose.Document<unknown, {}, IThesis> & IThesis & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
