"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const User_1 = __importDefault(require("../models/User"));
const Student_1 = __importDefault(require("../models/Student"));
const Supervisor_1 = __importDefault(require("../models/Supervisor"));
const router = (0, express_1.Router)();
// PUT /users/profile
// Aktualizuj profil zalogowanego użytkownika
router.put("/profile", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        console.log("PUT /users/profile - Request received");
        console.log("Request body:", req.body);
        const userId = req.user?._id;
        console.log("User ID:", userId);
        if (!userId) {
            return res.status(401).json({ message: "Nieautoryzowany dostęp." });
        }
        const { firstName, lastName, email, faculty, studentData, supervisorData, } = req.body;
        // Walidacja podstawowych danych
        if (!firstName || !lastName || !email || !faculty) {
            return res.status(400).json({
                message: "Imię, nazwisko, email i wydział są wymagane.",
            });
        }
        // Sprawdź czy email nie jest już zajęty przez innego użytkownika
        const existingUser = await User_1.default.findOne({
            email,
            _id: { $ne: userId },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Ten adres email jest już zajęty.",
            });
        }
        // Znajdź użytkownika
        const user = await User_1.default.findById(userId)
            .populate("student")
            .populate("supervisor");
        if (!user) {
            return res.status(404).json({ message: "Nie znaleziono użytkownika." });
        }
        // Aktualizuj podstawowe dane użytkownika
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.faculty = faculty;
        // Aktualizuj dane studenta jeśli użytkownik jest studentem
        if (user.role === "STUDENT" && user.student && studentData) {
            const student = await Student_1.default.findById(user.student);
            if (student) {
                if (studentData.studiesType)
                    student.studiesType = studentData.studiesType;
                if (studentData.studiesStartDate)
                    student.studiesStartDate = new Date(studentData.studiesStartDate);
                if (studentData.degree)
                    student.degree = studentData.degree;
                await student.save();
            }
        }
        // Aktualizuj dane promotora jeśli użytkownik jest promotorem
        if (user.role === "SUPERVISOR" && user.supervisor && supervisorData) {
            const supervisor = await Supervisor_1.default.findById(user.supervisor);
            if (supervisor) {
                if (supervisorData.academicTitle)
                    supervisor.academicTitle = supervisorData.academicTitle;
                if (supervisorData.selfInterests !== undefined)
                    supervisor.selfInterests = supervisorData.selfInterests;
                await supervisor.save();
            }
        }
        await user.save();
        // Pobierz zaktualizowane dane użytkownika z populacją
        const updatedUser = await User_1.default.findById(userId)
            .select("-password")
            .populate("student")
            .populate("supervisor");
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Błąd podczas aktualizacji profilu:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
exports.default = router;
