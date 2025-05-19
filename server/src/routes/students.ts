import { Router, Request, Response, NextFunction } from 'express';
import { verifyAccessTokenMiddleware, AuthRequest } from '../middlewares/auth';
import Student, { IStudent } from '../models/Student';
import RequestModel, { IRequest } from '../models/Request';
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

// NOWE - GET /students/{id}/requests - zakładamy wg tego, że request model jest potrzebny - dodalem Request.ts po to
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

        // Fetch requests associated with the student
        const requests: IRequest[] = await RequestModel.find({ student: studentId })
            .populate('supervisor') // Populate supervisor details
            .populate('thesis'); // Populate thesis details (if any)

        res.status(200).json(requests);

    } catch (error) {
        console.error('Błąd podczas pobierania zgłoszeń studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;