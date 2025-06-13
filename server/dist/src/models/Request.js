"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Request.ts
const mongoose_1 = __importDefault(require("mongoose"));
const requestSchema = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    supervisor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Supervisor",
        required: true,
    },
    thesis: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Thesis",
        required: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Request", requestSchema);
