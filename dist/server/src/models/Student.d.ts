import mongoose from 'mongoose';
export interface IStudent extends mongoose.Document {
    studiesType: "BACHELOR" | "ENGINEERING" | "MASTER" | "DOCTORATE" | "POST-GRADUATE" | "OTHER";
    studiesStartDate: Date;
    degree: string;
    thesisList: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent> & IStudent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
