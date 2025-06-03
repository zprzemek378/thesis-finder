// src/models/User.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  faculty: string;
  role: 'STUDENT' | 'ADMIN' | 'SUPERVISOR';
  student: mongoose.Types.ObjectId | null;
  supervisor: mongoose.Types.ObjectId | null;
  chats: mongoose.Types.ObjectId[] | null;

  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  faculty: { type: String, required: true },
  role: {
    type: String,
    enum: ['STUDENT', 'ADMIN', 'SUPERVISOR'],
    required: true,
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', default: null },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat', default: null }],
});

// logika hashowania
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt_number = process.env.SALT_NUMBER || '10';
  const salt = await bcrypt.genSalt(Number(salt_number));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// metoda porównująca hasło
userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
