"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Student.ts
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    studiesType: { type: String, enum: ["BACHELOR", "ENGINEERING", "MASTER", "DOCTORATE", "POST-GRADUATE", "OTHER"], required: true },
    studiesStartDate: { type: Date, required: true },
    degree: { type: String, required: true },
    thesisList: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Thesis",
            default: null
        }],
});
exports.default = mongoose_1.default.model("Student", studentSchema);
