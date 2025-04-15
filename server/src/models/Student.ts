import mongoose from 'mongoose';

export interface IStudent extends mongoose.Document {
  studiesType: "BACHELOR" | "ENGINEERING" | "MASTER" | "DOCTORATE" | "POST-GRADUATE" | "OTHER";
  studiesStartDate: Date;
  degree: string;
  thesisList: mongoose.Types.ObjectId[];
}

const studentSchema = new mongoose.Schema<IStudent>({
  studiesType: { type: String, enum: ["BACHELOR", "ENGINEERING", "MASTER", "DOCTORATE", "POST-GRADUATE", "OTHER"], required: true },
  studiesStartDate: { type: Date, required: true },
  degree: { type: String, required: true },
  thesisList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thesis",
    default: null
  }],
});

export default mongoose.model<IStudent>("Student", studentSchema);