// src/models/Request.ts
import mongoose from "mongoose";

export interface IRequest extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  supervisor: mongoose.Types.ObjectId;
  thesis?: mongoose.Types.ObjectId;
  content?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  type: "THESIS_ENROLLMENT" | "OWN_THESIS_PROPOSAL" | "OTHER";
  createdAt: Date;
  updatedAt: Date;
  thesisId: mongoose.Types.ObjectId;
}

const requestSchema = new mongoose.Schema<IRequest>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true,
    },
    thesis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thesis",
      required: false,
    },
    content: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    type: {
      type: String,
      enum: ["THESIS_ENROLLMENT", "OWN_THESIS_PROPOSAL", "OTHER"],
      required: true,
    },
    thesisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thesis",
      required: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model<IRequest>("Request", requestSchema);
