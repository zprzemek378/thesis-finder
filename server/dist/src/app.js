"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const students_1 = __importDefault(require("./routes/students"));
const supervisors_1 = __importDefault(require("./routes/supervisors"));
const theses_1 = __importDefault(require("./routes/theses"));
const requests_1 = __importDefault(require("./routes/requests"));
const messages_1 = __importDefault(require("./routes/messages"));
const users_1 = __importDefault(require("./routes/users"));
const chats_1 = __importDefault(require("./routes/chats"));
const auth_2 = require("./middlewares/auth");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || ["http://localhost:5173"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("IO Thesis Finder project - Welcome to API!");
});
app.use("/auth", auth_1.default);
app.use(auth_2.verifyAccessTokenMiddleware);
app.use("/students", students_1.default);
app.use("/supervisors", supervisors_1.default);
app.use("/theses", theses_1.default);
app.use("/requests", requests_1.default);
app.use("/messages", messages_1.default);
app.use("/users", users_1.default);
app.use("/chats", chats_1.default);
app.get("/protected", (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});
app.post("/data", (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hello, ${name}!` });
});
exports.default = app;
