"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const Supervisor_1 = __importDefault(require("../models/Supervisor"));
const Thesis_1 = __importDefault(require("../models/Thesis"));
const Request_1 = __importDefault(require("../models/Request"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// GET /Supervisors
// Pobierz listę wszystkich promotorów
router.get("/", auth_1.verifyAccessTokenMiddleware, async (req, res) => {
    try {
        const supervisors = await Supervisor_1.default.find();
        // Pobierz dane użytkowników dla wszystkich promotorów
        const supervisorsWithUsers = await Promise.all(supervisors.map(async (supervisor) => {
            const supervisorUser = await User_1.default.findOne({
                supervisor: supervisor._id,
            });
            return {
                ...supervisor.toObject(),
                user: supervisorUser ? supervisorUser.toObject() : null,
            };
        }));
        res.status(200).json(supervisorsWithUsers);
    }
    catch (error) {
        console.error("Błąd podczas pobierania listy promotorów:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// GET /Supervisors/{id}
// Pobierz promotora po ID
router.get("/:id", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const supervisorId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(supervisorId)) {
            return res
                .status(400)
                .json({ message: "Nieprawidłowy format ID promotora." });
        }
        const supervisor = await Supervisor_1.default.findById(supervisorId);
        if (!supervisor) {
            return res.status(404).json({ message: "Nie znaleziono promotora." });
        }
        res.status(200).json(supervisor);
    }
    catch (error) {
        console.error("Błąd podczas pobierania promotora po ID:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// GET /Supervisors/{id}/theses
// Pobierz prace dyplomowe promotora o podanym ID
router.get("/:id/theses", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const supervisorId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(supervisorId)) {
            return res
                .status(400)
                .json({ message: "Nieprawidłowy format ID promotora." });
        }
        const theses = await Thesis_1.default.find({ supervisor: supervisorId });
        res.status(200).json(theses);
    }
    catch (error) {
        console.error("Błąd podczas pobierania prac dyplomowych promotora:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// GET /Supervisors/{id}/requests
// Pobierz listę zapytań (propozycji prac) od studentów do promotora o podanym ID
router.get("/:id/requests", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const supervisorId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(supervisorId)) {
            return res
                .status(400)
                .json({ message: "Nieprawidłowy format ID promotora." });
        }
        const requests = await Request_1.default.find({
            supervisor: supervisorId,
        }).populate("student");
        const requestsWithUser = await Promise.all(requests.map(async (req) => {
            if (!req.student) {
                return {
                    ...req.toObject(),
                    studentUser: null,
                };
            }
            const user = await User_1.default.findOne({ student: req.student._id });
            return {
                ...req.toObject(),
                studentUser: user,
            };
        }));
        res.status(200).json(requestsWithUser);
    }
    catch (error) {
        console.error("Błąd podczas pobierania zapytań do promotora:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// GET /Supervisors/{id}/availability
// Pobierz informacje o dostępności promotora
router.get("/:id/availability", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const supervisorId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(supervisorId)) {
            return res
                .status(400)
                .json({ message: "Nieprawidłowy format ID promotora." });
        }
        const supervisor = await Supervisor_1.default.findById(supervisorId);
        if (!supervisor) {
            return res.status(404).json({ message: "Nie znaleziono promotora." });
        }
        res.status(200).json({ availability: supervisor.availability });
    }
    catch (error) {
        console.error("Błąd podczas pobierania dostępności promotora:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// PUT /Supervisors/{id}
// Aktualizuj dane promotora o podanym ID (tylko dla administratora)
router.put("/:id", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const supervisorId = req.params.id;
        const userRole = req.user.role;
        if (userRole !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "Brak uprawnień do aktualizacji promotora." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(supervisorId)) {
            return res
                .status(400)
                .json({ message: "Nieprawidłowy format ID promotora." });
        }
        const updateData = req.body;
        const updatedSupervisor = await Supervisor_1.default.findByIdAndUpdate(supervisorId, updateData, {
            new: true,
        });
        if (!updatedSupervisor) {
            return res.status(404).json({ message: "Nie znaleziono promotora." });
        }
        res.status(200).json(updatedSupervisor);
    }
    catch (error) {
        console.error("Błąd podczas aktualizacji promotora:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// DELETE /Supervisors/{id}
// Usuń promotora o podanym ID (dostępne tylko dla administratora)
router.delete("/:id", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const supervisorId = req.params.id;
        const userRole = req.user.role;
        if (userRole !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "Brak uprawnień do usunięcia promotora." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(supervisorId)) {
            return res
                .status(400)
                .json({ message: "Nieprawidłowy format ID promotora." });
        }
        const deletedSupervisor = await Supervisor_1.default.findByIdAndDelete(supervisorId);
        if (!deletedSupervisor) {
            return res.status(404).json({ message: "Nie znaleziono promotora." });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Błąd podczas usuwania promotora:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
exports.default = router;
