import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  faculty: string;
  role: "STUDENT" | "ADMIN" | "SUPERVISOR";
  student: mongoose.Types.ObjectId | null;
  supervisor: mongoose.Types.ObjectId | null;
  chats: mongoose.Types.ObjectId[] | null;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  faculty: { type: String, required: true },
  role: { type: String, enum: ["STUDENT", "ADMIN", "SUPERVISOR"], required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    default: null
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
    default: null
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    default: null
  }]
});

export default mongoose.model<IUser>("User", userSchema);