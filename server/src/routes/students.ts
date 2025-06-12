import { Router, Request, NextFunction } from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/auth';
import Student, { IStudent } from '../models/Student';
import RequestModel, { IRequest } from '../models/Request';
import User from '../models/User';
import mongoose from 'mongoose';

const router = Router();

// GET /students
// Pobierz listę wszystkich studentów
router.get('/', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find all users that are students with their student data
        const users = await User.find({ role: 'STUDENT' })
            .select('-password')
            .populate('student');
            
        res.status(200).json(users);
    } catch (error) {
        console.error('Błąd podczas pobierania listy studentów:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
});

// GET /students/{id}
// Pobierz studenta po ID
router.get('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const studentId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

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

// GET /students/{id}/theses
// Pobierz prace dyplomowe studenta o podanym ID
router.get('/:id/theses', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const studentId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

        const student: IStudent | null = await Student.findById(studentId).populate('thesisList');
        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }

        res.status(200).json(student.thesisList);

    } catch (error) {
        console.error('Błąd podczas pobierania prac dyplomowych studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// GET /students/{id}/requests 
// Pobierz listę zgłoszeń studenta o podanym ID - zakładamy, że request model jest potrzebny 
router.get('/:id/requests', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const studentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }

        const requests: IRequest[] = await RequestModel.find({ student: studentId })
            .populate('supervisor') 
            .populate('thesis'); 

        res.status(200).json(requests);

    } catch (error) {
        console.error('Błąd podczas pobierania zgłoszeń studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// PUT /Students/{id} 
// Zaaktualizuj dane studenta
router.put('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const studentId = req.params.id;
        const userId = req.user?._id?.toString();
        const userRole = req.user!.role;

        if (userRole !== 'ADMIN' && userId !== studentId) {
            return res.status(403).json({ message: 'Brak uprawnień do aktualizacji tego studenta.' });
        }

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

        const updateData: Partial<IStudent> = req.body; 

        // Mozna dodac jakas walidacje danych, ale mi sie nie chce w to bawic XD
        // if (updateData.indexNumber !== undefined && typeof updateData.indexNumber !== 'string') {
        //     return res.status(400).json({ message: 'Numer indeksu musi być ciągiem znaków.' });
        // }
        
        const updatedStudent: IStudent | null = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }

        res.status(200).json(updatedStudent);

    } catch (error) {
        console.error('Błąd podczas aktualizacji studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// DELETE /students/{id} 
// Usunięcie studenta
router.delete('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const studentId = req.params.id;
        const userRole = req.user!.role; 

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do usunięcia studenta.' });
        }
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }
        
        const deletedStudent: IStudent | null = await Student.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Nie znaleziono studenta.' });
        }

        res.status(204).send();

    } catch (error) {
        console.error('Błąd podczas usuwania studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;