// src/models/Thesis.ts 
import mongoose from 'mongoose';

export interface IThesis extends mongoose.Document {
    title: string;
    description: string;
    degree: 'BACHELOR' | 'MASTER' | 'DOCTORAL' | 'POSTGRADUATE';                         
    field: string;
    supervisor: mongoose.Types.ObjectId;
    students: mongoose.Types.ObjectId[];
    status: 'FREE' | 'TAKEN' | 'PENDING_APPROVAL' | 'ARCHIVED'; 
    tags: string[];
    studentsLimit: number; 
    createdAt: Date;
    updatedAt: Date; 
}

const thesisSchema = new mongoose.Schema<IThesis>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    degree: { 
        type: String,
        enum: ['BACHELOR', 'MASTER', 'DOCTORAL', 'POSTGRADUATE'],
        required: true
    },
    field: { type: String, required: true },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supervisor",
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student" 
    }],
    status: { 
        type: String,
        enum: ['FREE', 'TAKEN', 'PENDING_APPROVAL', 'ARCHIVED'],
        default: 'FREE',
        required: true
    },
    tags: [{ type: String }],
    studentsLimit: { type: Number, default: 1, required: true }, 
}, { timestamps: true }); 

export default mongoose.model<IThesis>("Thesis", thesisSchema);