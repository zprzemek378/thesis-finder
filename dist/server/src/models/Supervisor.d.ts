import mongoose from 'mongoose';
export interface ISupervisor extends mongoose.Document {
    thesisLimit: number;
    academicTitle: string;
    selfInterests: string;
    thesisList: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<ISupervisor, {}, {}, {}, mongoose.Document<unknown, {}, ISupervisor> & ISupervisor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
