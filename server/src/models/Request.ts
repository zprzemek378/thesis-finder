import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Import IUser for supervisor and student
import { IThesis } from './Thesis'; // Import IThesis if you want to link to a thesis

export interface IRequest extends Document {
    student: Types.ObjectId | IUser; // Reference to the student
    supervisor: Types.ObjectId | IUser; // Reference to the supervisor
    thesisTitle: string; // Title of the proposed thesis
    description: string; // Detailed description of the proposal
    status: string; // e.g., 'pending', 'approved', 'rejected'
    createdAt: Date;
    updatedAt: Date;
    thesis?: Types.ObjectId | IThesis; // Optional: Link to an existing Thesis
}

const requestSchema: Schema<IRequest> = new Schema<IRequest>({ // Explicit type for Schema
    student: {
        type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types
        ref: 'User',
        required: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types
        ref: 'User',
        required: true
    },
    thesisTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    thesis: {
        type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types
        ref: 'Thesis',
        default: null
    }
}, { timestamps: true });

const RequestModel = mongoose.model<IRequest>('Request', requestSchema);
export default RequestModel;