"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Thesis.ts 
const mongoose_1 = __importDefault(require("mongoose"));
const thesisSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    degree: {
        type: String,
        enum: ['BACHELOR', 'MASTER', 'DOCTORAL', 'POSTGRADUATE'],
        required: true
    },
    field: { type: String, required: true },
    supervisor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Supervisor",
        required: true
    },
    students: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model("Thesis", thesisSchema);
