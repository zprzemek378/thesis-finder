"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("IO Thesis Finder project - Welcome to API!");
});
app.post("/data", (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hello, ${name}!` });
});
exports.default = app;
