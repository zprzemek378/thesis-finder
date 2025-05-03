"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const thesisSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    degree: { type: String, required: true },
    faculty: { type: String, required: true },
    supervisor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Supervisor",
        required: true
    },
    studentsLimit: { type: Number, required: true },
    students: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Student",
            default: null
        }],
    status: { type: String, enum: ["FREE", "IN_PROGRESS", "TAKEN", "FINISHED"], required: true },
    tags: [{ type: String, required: false }]
});
exports.default = mongoose_1.default.model("Thesis", thesisSchema);
