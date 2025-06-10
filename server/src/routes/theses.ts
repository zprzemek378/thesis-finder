import { Router, Request, Response, NextFunction } from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/auth';
import Thesis, { IThesis } from '../models/Thesis';
import Student, { IStudent } from '../models/Student';
import Supervisor, { ISupervisor } from '../models/Supervisor';
import mongoose from 'mongoose';

const router = Router();

router.get('/', verifyAccessTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { degree, field } = req.query;
        let filter: any = {};

        if (degree) filter.degree = degree;
        if (field) filter.field = field;

        const theses: IThesis[] = await Thesis.find(filter)
            .populate('supervisor')
            .populate('students');

        res.status(200).json(theses);
    } catch (error) {
        console.error('Błąd podczas pobierania listy prac dyplomowych:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

router.get('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }

        const thesis: IThesis | null = await Thesis.findById(thesisId)
            .populate('supervisor')
            .populate('students');

        if (!thesis) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }

        res.status(200).json(thesis);
    } catch (error) {
        console.error('Błąd podczas pobierania pracy dyplomowej po ID:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

router.get('/:id/students', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
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

router.post('/', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const {
            title,
            description,
            degree,
            field,
            supervisor: supervisorId,
            students: initialStudentIds,
            status,
            tags,
            studentsLimit,
        } = req.body;

        const userRole = req.user!.role;
        const loggedInUserId = req.user!._id;

        if (userRole !== 'SUPERVISOR' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do dodawania pracy dyplomowej.' });
        }

        if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID promotora.' });
        }

        const supervisorProfile: ISupervisor | null = await Supervisor.findById(supervisorId);
        if (!supervisorProfile) {
            return res.status(404).json({ message: 'Nie znaleziono profilu promotora.' });
        }

        if (!Array.isArray(supervisorProfile.thesisList)) {
            supervisorProfile.thesisList = [];
        }

        let thesisLimit: number;
        switch (degree) {
            case 'BACHELOR':
                thesisLimit = 8;
                break;
            case 'MASTER':
            case 'DOCTORAL':
            case 'POSTGRADUATE':
                thesisLimit = 6;
                break;
            default:
                return res.status(400).json({
                    message: 'Nieprawidłowy stopień pracy dyplomowej. Oczekiwano "BACHELOR", "MASTER", "DOCTORAL" lub "POSTGRADUATE".',
                });
        }

        const existingThesesCount = await Thesis.countDocuments({
            supervisor: supervisorId,
            degree,
        });

        if (existingThesesCount >= thesisLimit) {
            return res.status(400).json({
                message: `Promotor (${supervisorProfile.academicTitle}) osiągnął limit ${thesisLimit} prac dyplomowych.`,
            });
        }

        if (
            Array.isArray(supervisorProfile.allowedFields) &&
            supervisorProfile.allowedFields.length > 0 &&
            !supervisorProfile.allowedFields.includes(field)
        ) {
            return res.status(400).json({
                message: `Promotor nie jest uprawniony do prowadzenia prac w dziale: "${field}". Dozwolone działy: ${supervisorProfile.allowedFields.join(', ')}.`,
            });
        }

        const studentsToAssign: mongoose.Types.ObjectId[] = [];
        if (initialStudentIds && initialStudentIds.length > 0) {
            for (const studentId of initialStudentIds) {
                if (!mongoose.Types.ObjectId.isValid(studentId)) {
                    return res.status(400).json({ message: `Nieprawidłowy format ID studenta: ${studentId}.` });
                }
                const studentExists = await Student.findById(studentId);
                if (!studentExists) {
                    return res.status(404).json({ message: `Student o ID ${studentId} nie istnieje.` });
                }
                studentsToAssign.push(new mongoose.Types.ObjectId(studentId));
            }
            if (studentsToAssign.length > (studentsLimit || 1)) {
                return res.status(400).json({
                    message: `Liczba przypisanych studentów (${studentsToAssign.length}) przekracza limit pracy (${studentsLimit || 1}).`,
                });
            }
        }

        const newThesis: IThesis = new Thesis({
            title,
            description,
            degree,
            field,
            supervisor: supervisorId,
            students: studentsToAssign,
            status: studentsToAssign.length > 0 ? 'TAKEN' : 'FREE',
            tags: tags || [],
            studentsLimit: studentsLimit || 1,
        });

        const savedThesis = await newThesis.save();

        await Supervisor.findByIdAndUpdate(supervisorId, {
            $push: { thesisList: savedThesis._id },
        });

        res.status(201).json(savedThesis);
    } catch (error) {
        console.error('Błąd podczas dodawania nowej pracy dyplomowej:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

router.post('/:id/students', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    const session = await mongoose.startSession();
    try {
        const thesisId = req.params.id;
        const studentId = req.user!._id;
        const userRole = req.user!.role;

        if (userRole !== 'STUDENT') {
            return res.status(403).json({ message: 'Tylko studenci mogą zapisywać się na prace dyplomowe.' });
        }

        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }

        session.startTransaction();

        const thesis = await Thesis.findById(thesisId).session(session);
        if (!thesis) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }

        if (thesis.students.length >= thesis.studentsLimit) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: 'Limit studentów został osiągnięty.' });
        }

        if (thesis.students.includes(studentId)) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: 'Student jest już zapisany.' });
        }

        const studentProfile = await Student.findById(studentId).session(session);
        if (!studentProfile) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({ message: 'Nie znaleziono profilu studenta.' });
        }

        studentProfile.thesisList.push(thesis._id as mongoose.Types.ObjectId);
        await studentProfile.save({ session });

        thesis.students.push(studentId);
        if (thesis.students.length >= thesis.studentsLimit) {
            thesis.status = 'TAKEN';
        }
        await thesis.save({ session });

        await session.commitTransaction();
        await session.endSession();

        res.status(200).json(thesis);
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        console.error('Błąd podczas zapisywania studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

router.delete('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }

        const userRole = req.user!.role;
        const loggedInUserId = req.user!._id;

        const thesis = await Thesis.findById(thesisId);
        if (!thesis) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }

        if (userRole !== 'ADMIN' && thesis.supervisor.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: 'Brak uprawnień do usunięcia pracy.' });
        }

        await Thesis.findByIdAndDelete(thesisId);
        await Supervisor.findByIdAndUpdate(thesis.supervisor, {
            $pull: { thesisList: thesis._id },
        });

        res.status(200).json({ message: 'Praca została usunięta.' });
    } catch (error) {
        console.error('Błąd podczas usuwania pracy dyplomowej:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;
