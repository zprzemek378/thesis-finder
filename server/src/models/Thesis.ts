// src/models/Thesis.ts
import mongoose from 'mongoose';
import Supervisor from './Supervisor';

export interface IThesis extends mongoose.Document {
    title: string,
    description: string,
    degree: string,
    faculty: string,
    supervisor: mongoose.Types.ObjectId,
    studentsLimit: number,
    students: mongoose.Types.ObjectId[],
    status: "FREE" | "IN_PROGRESS" | "TAKEN" | "FINISHED"
    tags: string[]
}

const thesisSchema = new mongoose.Schema<IThesis>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    degree: { type: String, required: true },
    faculty: { type: String, required: true },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supervisor",
        required: true
    },
    studentsLimit: { type: Number, required: true },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        default: null
    }],
    status: { type: String, enum: ["FREE", "IN_PROGRESS", "TAKEN", "FINISHED"], required: true },
    tags: [{ type: String, required: false }]
});

export default mongoose.model<IThesis>("Thesis", thesisSchema);