import mongoose from 'mongoose';

export interface ISupervisor extends mongoose.Document {
  thesisLimit: number;
  academicTitle: string;
  selfInterests: string
  thesisList: mongoose.Types.ObjectId[];
}

const supervisorSchema = new mongoose.Schema<ISupervisor>({
  thesisLimit: { type: Number, required: true },
  academicTitle: { type: String, required: true },
  selfInterests: { type: String, required: true },
  thesisList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thesis",
    default: null
  }],
});

export default mongoose.model<ISupervisor>("Supervisor", supervisorSchema);