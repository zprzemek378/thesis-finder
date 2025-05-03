"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supervisorSchema = new mongoose_1.default.Schema({
    thesisLimit: { type: Number, required: true },
    academicTitle: { type: String, required: true },
    selfInterests: { type: String, required: true },
    thesisList: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Thesis",
            default: null
        }],
});
exports.default = mongoose_1.default.model("Supervisor", supervisorSchema);
