"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Student_1 = __importDefault(require("../models/Student"));
const Supervisor_1 = __importDefault(require("../models/Supervisor"));
const auth_1 = require("../middlewares/auth");
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
// POST /register
// Rejestracja nowego użytkownika
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, faculty, role, studentData, supervisorData, } = req.body;
    try {
        const exists = await User_1.default.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email zajęty" });
        // Tworzymy pusty obiekt, żeby przypisać ID po kolei
        let studentId = null;
        let supervisorId = null;
        // Tworzymy użytkownika jako pierwszy krok
        const user = await User_1.default.create({
            firstName,
            lastName,
            email,
            password,
            faculty,
            role,
            chats: [],
        });
        // Student
        if (role === "STUDENT" && studentData) {
            const newStudent = await Student_1.default.create(studentData);
            studentId = newStudent._id;
            // Dodajemy referencję w User
            user.student = studentId; // <-- KLUCZOWE
            await user.save();
        }
        // Supervisor
        if (role === "SUPERVISOR" && supervisorData) {
            const newSupervisor = await Supervisor_1.default.create({
                ...supervisorData,
                userId: user._id, // <-- KLUCZOWE
            });
            supervisorId = newSupervisor._id;
            // Dodajemy referencję w User
            user.supervisor = supervisorId;
            await user.save();
        }
        res.status(201).json({ id: user._id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera" });
    }
});
// POST /login
// Logowanie użytkownika
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            console.warn(`Użytkownik o emailu ${email} nie istnieje`);
            return res
                .status(401)
                .json({ message: "Nieprawidłowe dane logowania (email)" });
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            console.warn(`Nieprawidłowe hasło dla użytkownika ${email}`);
            return res
                .status(401)
                .json({ message: "Nieprawidłowe dane logowania (hasło)" });
        }
        const accessToken = (0, jwt_1.signAccessToken)(user);
        const refreshToken = (0, jwt_1.signRefreshToken)(user);
        // Prepare user data to send (excluding sensitive information)
        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            faculty: user.faculty,
            supervisor: user.supervisor,
            student: user.student,
        };
        res
            .cookie("jid", refreshToken, { httpOnly: true, path: "/auth/refresh" })
            .json({
            accessToken,
            user: userData,
        });
    }
    catch (error) {
        console.error("Błąd podczas logowania:", error);
        res.status(500).json({
            message: "Błąd serwera",
            error: error.message || "Nieznany błąd",
        });
    }
});
// POST /refresh
// Odświeżanie tokena
router.post("/refresh", async (req, res) => {
    const token = req.cookies.jid;
    if (!token)
        return res.status(401).json({ message: "Brak tokena" });
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await User_1.default.findById(payload.sub);
        if (!user)
            throw new Error();
        const newAccess = (0, jwt_1.signAccessToken)(user);
        const newRefresh = (0, jwt_1.signRefreshToken)(user);
        res
            .cookie("jid", newRefresh, { httpOnly: true, path: "/auth/refresh" })
            .json({ accessToken: newAccess });
    }
    catch {
        res.clearCookie("jid", { path: "/auth/refresh" });
        res.status(401).json({ message: "Invalid refresh token" });
    }
});
// POST /logout
// Wylogowanie użytkownika
router.post("/logout", (_req, res) => {
    res.clearCookie("jid", { path: "/auth/refresh" }).json({ success: true });
});
// GET /auth/me
// Pobranie informacji o zalogowanym użytkowniku
router.get("/me", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Nieautoryzowany dostęp." });
        }
        const user = await User_1.default.findById(userId)
            .select("-password")
            .populate("student")
            .populate("supervisor");
        if (!user) {
            return res.status(404).json({ message: "Nie znaleziono użytkownika." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Błąd podczas pobierania informacji o użytkowniku:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
exports.default = router;
