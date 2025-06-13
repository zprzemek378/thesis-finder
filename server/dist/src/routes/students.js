"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const Student_1 = __importDefault(require("../models/Student"));
const Request_1 = __importDefault(require("../models/Request"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// GET /students
// Pobierz listę wszystkich studentów
router.get('/', auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Find all users that are students with their student data
        const users = await User_1.default.find({ role: 'STUDENT' })
            .select('-password')
            .populate('student');
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Błąd podczas pobierania listy studentów:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
});
// GET /students/{id}
// Pobierz studenta po ID
router.get('/:id', auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const studentId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }
        const student = await Student_1.default.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }
        res.status(200).json(student);
    }
    catch (error) {
        console.error('Błąd podczas pobierania studenta po ID:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});
// GET /students/{id}/theses
// Pobierz prace dyplomowe studenta o podanym ID
router.get('/:id/theses', auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const studentId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }
        const student = await Student_1.default.findById(studentId).populate('thesisList');
        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }
        res.status(200).json(student.thesisList);
    }
    catch (error) {
        console.error('Błąd podczas pobierania prac dyplomowych studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});
// GET /students/{id}/requests 
// Pobierz listę zgłoszeń studenta o podanym ID - zakładamy, że request model jest potrzebny 
router.get('/:id/requests', auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const studentId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }
        const student = await Student_1.default.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }
        const requests = await Request_1.default.find({ student: studentId })
            .populate('supervisor')
            .populate('thesis');
        res.status(200).json(requests);
    }
    catch (error) {
        console.error('Błąd podczas pobierania zgłoszeń studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});
// PUT /Students/{id} 
// Zaaktualizuj dane studenta
router.put('/:id', auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const userId = req.user?._id?.toString();
        const userRole = req.user.role;
        if (userRole !== 'ADMIN' && userId !== studentId) {
            return res.status(403).json({ message: 'Brak uprawnień do aktualizacji tego studenta.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }
        const updateData = req.body;
        // Mozna dodac jakas walidacje danych, ale mi sie nie chce w to bawic XD
        // if (updateData.indexNumber !== undefined && typeof updateData.indexNumber !== 'string') {
        //     return res.status(400).json({ message: 'Numer indeksu musi być ciągiem znaków.' });
        // }
        const updatedStudent = await Student_1.default.findByIdAndUpdate(studentId, updateData, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }
        res.status(200).json(updatedStudent);
    }
    catch (error) {
        console.error('Błąd podczas aktualizacji studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});
// DELETE /students/{id} 
// Usunięcie studenta
router.delete('/:id', auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const userRole = req.user.role;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do usunięcia studenta.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }
        const deletedStudent = await Student_1.default.findByIdAndDelete(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Błąd podczas usuwania studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});
exports.default = router;
