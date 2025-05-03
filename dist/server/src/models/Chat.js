"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    messages: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        }],
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }],
});
exports.default = mongoose_1.default.model("Student", chatSchema);
