import { Router, Request, Response, NextFunction } from 'express';
import { verifyAccessTokenMiddleware, AuthRequest } from '../middlewares/auth';
import Student, { IStudent } from '../models/Student';
import Thesis, { IThesis } from '../models/Thesis';
import mongoose from 'mongoose';

const router = Router();

// NOWE - GET /students
// Pobierz listę wszystkich studentów
router.get('/', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Pobierz wszystkich studentów z bazy danych
        const students: IStudent[] = await Student.find();

        // Zwróć listę studentów
        res.status(200).json(students);

    } catch (error) {
        console.error('Błąd podczas pobierania listy studentów:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - GET /students/{id}
// Pobierz studenta po ID
router.get('/:id', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params.id;

        // Opcjonalna walidacja ID (sprawdzenie czy to poprawny ObjectId)
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

        //  Execute the Mongoose Query and explicitly type the result (can be IStudent or null)
        const student: IStudent | null = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }

        res.status(200).json(student);

    } catch (error) {
        console.error('Błąd podczas pobierania studenta po ID:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});


// NOWE - GET /students/{id}/theses
// Pobierz prace dyplomowe studenta o podanym ID
router.get('/:id/theses', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

        // Znajdź studenta i wypełnij listę prac dyplomowych
        const student: IStudent | null = await Student.findById(studentId).populate('thesisList');

        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }

        // Zwróć listę prac dyplomowych studenta
        res.status(200).json(student.thesisList);

    } catch (error) {
        console.error('Błąd podczas pobierania prac dyplomowych studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - GET /students/{id}/requests - zakładamy wg tego, że jakby praca jest wnioskiem, ale nwm czy to na pewno git
// Pobierz listę zgłoszeń studenta o podanym ID
router.get('/:id/requests', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }

        //  Fetch theses "requested" by the student
        //  IMPORTANT:  You MUST replace 'requestedByStudent' with the ACTUAL field name in your Thesis model
        const requests: IThesis[] = await Thesis.find({ requestedByStudent: studentId })
            .populate('supervisor') //  If you need supervisor details
            .populate('students');  //  If you need student details

        res.status(200).json(requests);

    } catch (error) {
        console.error('Błąd podczas pobierania zgłoszeń studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;