"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/User.ts
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
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
    student: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Student', default: null },
    supervisor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Supervisor', default: null },
    chats: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Chat', default: null }],
});
// logika hashowania
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt_number = process.env.SALT_NUMBER || '10';
    const salt = await bcryptjs_1.default.genSalt(Number(salt_number));
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// metoda porównująca hasło
userSchema.methods.comparePassword = function (candidate) {
    return bcryptjs_1.default.compare(candidate, this.password);
};
exports.default = mongoose_1.default.model('User', userSchema);
