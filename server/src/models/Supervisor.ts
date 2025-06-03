// src/models/Supervisor.ts 
import mongoose from 'mongoose';

export interface ISupervisor extends mongoose.Document {
    userId: mongoose.Types.ObjectId; 
    academicTitle: string; 
    selfInterests: string[]; 
    availability: string;
    thesisList: mongoose.Types.ObjectId[]; 
    allowedFields: string[];
}

const supervisorSchema = new mongoose.Schema<ISupervisor>({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true 
    },
    academicTitle: { type: String, required: true },                            // decyduje o ilosci pracy!
    selfInterests: [{ type: String }], 
    thesisList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thesis",
        default: [] 
    }],
    availability: { type: String },
    allowedFields: [{ type: String, default: [] }],
});

export default mongoose.model<ISupervisor>("Supervisor", supervisorSchema);