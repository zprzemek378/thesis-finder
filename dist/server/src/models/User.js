"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    faculty: { type: String, required: true },
    role: { type: String, enum: ["STUDENT", "ADMIN", "SUPERVISOR"], required: true },
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Student",
        default: null
    },
    supervisor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Supervisor",
        default: null
    },
    chats: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Chat",
            default: null
        }]
});
exports.default = mongoose_1.default.model("User", userSchema);
