"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Supervisor.ts 
const mongoose_1 = __importDefault(require("mongoose"));
const supervisorSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    academicTitle: { type: String, required: true },
    selfInterests: [{ type: String }],
    thesisList: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Thesis",
            default: []
        }],
    availability: { type: String },
    allowedFields: [{ type: String, default: [] }],
});
exports.default = mongoose_1.default.model("Supervisor", supervisorSchema);
