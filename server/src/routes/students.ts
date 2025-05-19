import { Router, Request, Response, NextFunction } from 'express';
import { verifyAccessTokenMiddleware, AuthRequest } from '../middlewares/auth';
import Student, { IStudent } from '../models/Student';

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

export default router;