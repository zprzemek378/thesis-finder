import { Router, Request, Response, NextFunction } from 'express';
import { verifyAccessTokenMiddleware, AuthRequest } from '../middlewares/auth';
import Thesis, { IThesis } from '../models/Thesis';
import Student, { IStudent } from '../models/Student';
import mongoose from 'mongoose';

const router = Router();

// NOWE - GET /Theses
// Pobierz listę wszystkich prac dyplomowych
router.get('/', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const theses: IThesis[] = await Thesis.find().populate('supervisor').populate('students'); // Populate supervisor and students
        res.status(200).json(theses);
    } catch (error) {
        console.error('Błąd podczas pobierania listy prac dyplomowych:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - GET /Theses/{id}
// Pobierz pracę dyplomową po ID
router.get('/:id', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }
        const thesis: IThesis | null = await Thesis.findById(thesisId).populate('supervisor').populate('students'); // Populate supervisor and students
        if (!thesis) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }
        res.status(200).json(thesis);
    } catch (error) {
        console.error('Błąd podczas pobierania pracy dyplomowej po ID:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - GET /Theses/{id}/students
// Pobierz listę studentów zapisanych na daną pracę dyplomową
router.get('/:id/students', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }
        const thesis: IThesis | null = await Thesis.findById(thesisId).populate('students');
        if (!thesis) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }
        res.status(200).json(thesis.students);
    } catch (error) {
        console.error('Błąd podczas pobierania studentów zapisanych na pracę dyplomową:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - POST /Theses
// Dodaj nową pracę dyplomową (dostępne tylko dla promotorów i administratorów)
router.post('/', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, degree, field, supervisor, students, status, tags } = req.body;
        const userRole = req.user!.role;

        if (userRole !== 'SUPERVISOR' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do dodawania pracy dyplomowej.' });
        }

        if (!mongoose.Types.ObjectId.isValid(supervisor)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID promotora.' });
        }

        const newThesis: IThesis = new Thesis({
            title,
            description,
            degree,
            field,
            supervisor,
            students,
            status,
            tags
        });

        const savedThesis = await newThesis.save();
        res.status(201).json(savedThesis);
    } catch (error) {
        console.error('Błąd podczas dodawania nowej pracy dyplomowej:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - PUT /Theses/{id}
// Aktualizuj pracę dyplomową o podanym ID (dostępne tylko dla promotorów i administratorów)
router.put('/:id', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        const userRole = req.user!.role;

        if (userRole !== 'SUPERVISOR' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do aktualizacji pracy dyplomowej.' });
        }

        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }

        const updateData: Partial<IThesis> = req.body;
        const updatedThesis: IThesis | null = await Thesis.findByIdAndUpdate(thesisId, updateData, { new: true });

        if (!updatedThesis) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }

        res.status(200).json(updatedThesis);
    } catch (error) {
        console.error('Błąd podczas aktualizacji pracy dyplomowej:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - DELETE /Theses/{id}
// Usuń pracę dyplomową o podanym ID (dostępne tylko dla administratorów)
router.delete('/:id', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        const userRole = req.user!.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do usunięcia pracy dyplomowej.' });
        }

        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }

        const deletedThesis: IThesis | null = await Thesis.findByIdAndDelete(thesisId);

        if (!deletedThesis) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Błąd podczas usuwania pracy dyplomowej:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;