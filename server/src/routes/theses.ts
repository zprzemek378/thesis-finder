import { Router, Request, NextFunction } from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/auth';
import Thesis, { IThesis } from '../models/Thesis';
import Student, { IStudent } from '../models/Student';
import Supervisor, { ISupervisor } from '../models/Supervisor';
import mongoose from 'mongoose';

const router = Router();

// GET /Theses
// Pobierz listę wszystkich prac dyplomowych
router.get('/', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const { degree, field } = req.query;
        let filter: any = {};

        if (degree) {
            filter.degree = degree;
        }
        if (field) {
            filter.field = field;
        }

        const theses: IThesis[] = await Thesis.find(filter).populate('supervisor').populate('students');
        res.status(200).json(theses);
    } catch (error) {
        console.error('Błąd podczas pobierania listy prac dyplomowych:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// GET /Theses/{id}
// Pobierz pracę dyplomową po ID
router.get('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }
        const thesis: IThesis | null = await Thesis.findById(thesisId).populate('supervisor').populate('students');
        if (!thesis) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }
        res.status(200).json(thesis);
    } catch (error) {
        console.error('Błąd podczas pobierania pracy dyplomowej po ID:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// GET /Theses/{id}/students
// Pobierz listę studentów zapisanych na daną pracę dyplomową
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

// POST /Theses
// Dodaj nową pracę dyplomową (dostępne tylko dla promotorów i administratorów)
router.post('/', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const { title, description, degree, field, supervisor: supervisorId, students: initialStudentIds, status, tags, studentsLimit } = req.body;
        const userRole = req.user!.role;
        const loggedInUserId = req.user!._id;

        if (userRole !== 'SUPERVISOR' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do dodawania pracy dyplomowej.' });
        }

        if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID promotora.' });
        }

        if (userRole === 'SUPERVISOR' && supervisorId.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: 'Promotor może dodawać prace tylko dla siebie.' });
        }

        const supervisorProfile: ISupervisor | null = await Supervisor.findById(supervisorId);
        if (!supervisorProfile) {
            return res.status(404).json({ message: 'Nie znaleziono profilu promotora.' });
        }

        if (!Array.isArray(supervisorProfile.thesisList)) {
            supervisorProfile.thesisList = [];
        }

        let thesisLimit: number;
        if (degree === 'BACHELOR') { 
            thesisLimit = 8;
        } else if (degree === 'MASTER' || degree === 'DOCTORAL' || degree === 'POSTGRADUATE') { 
            thesisLimit = 6;
        } else {
            return res.status(400).json({ message: 'Nieprawidłowy stopień pracy dyplomowej. Oczekiwano "BACHELOR", "MASTER", "DOCTORAL" lub "POSTGRADUATE".' });
        }

        const existingThesesCount = await Thesis.countDocuments({
            supervisor: supervisorId,
            degree: degree
        });

        if (existingThesesCount >= thesisLimit) {
            return res.status(400).json({ message: `Promotor (${supervisorProfile.academicTitle}) osiągnął limit ${thesisLimit} prac dyplomowych dostępnych dla niego.` });
        }

        if (Array.isArray(supervisorProfile.allowedFields) && supervisorProfile.allowedFields.length > 0 && !supervisorProfile.allowedFields.includes(field) && !supervisorProfile.allowedFields.includes(field)) {
            return res.status(400).json({ message: `Promotor nie jest uprawniony do prowadzenia prac w dziale: "${field}". Dozwolone działy: ${supervisorProfile.allowedFields.join(', ')}.` });
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
                return res.status(400).json({ message: `Liczba przypisanych studentów (${studentsToAssign.length}) przekracza limit pracy (${studentsLimit || 1}).` });
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

        supervisorProfile.thesisList.push(savedThesis._id as mongoose.Types.ObjectId);
        await supervisorProfile.save();

        res.status(201).json(savedThesis);
    } catch (error) {
        console.error('Błąd podczas dodawania nowej pracy dyplomowej:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// POST /theses/{id}/students
// Student zapisuje się na pracę dyplomową o podanym ID
router.post('/:id/students', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        const studentId = req.user!._id; 
        const userRole = req.user!.role;
        if (userRole !== 'STUDENT') {
            return res.status(403).json({ message: 'Tylko studenci mogą zapisywać się na prace dyplomowe tą metodą.' });
        }
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const thesis: IThesis | null = await Thesis.findById(thesisId).session(session);
            if (!thesis) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
            }
            const student: IStudent | null = await Student.findById(studentId).session(session);
            if (!student) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Nie znaleziono profilu studenta.' });
            }
            if (thesis.students.includes(studentId)) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Jesteś już zapisany na tę pracę dyplomową lub oczekujesz na zatwierdzenie.' });
            }
            if (thesis.studentsLimit <= thesis.students.length) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Praca dyplomowa nie ma już wolnych miejsc.' });
            }
            if (thesis.status !== 'FREE') {
                await session.abortTransaction();
                return res.status(400).json({ message: `Nie można zapisać się na tę pracę dyplomową. Jej status to: ${thesis.status}.` });
            }

            const RequestModel = mongoose.model('Request'); 
            const newRequest = new RequestModel({
                student: studentId,
                supervisor: thesis.supervisor, 
                thesis: thesisId,
                status: 'PENDING', 
                type: 'THESIS_ENROLLMENT', 
                createdAt: new Date()
            });
            await newRequest.save({ session });

            // Możesz zmienić status pracy na 'PENDING_APPROVAL' jeśli to pierwszy student, który się "zgłasza"
            // To może być kwestia dyskusyjna, czy praca ma status 'PENDING_APPROVAL' czy 'FREE' dopóki nie ma przypisanych studentów
            // W tym przypadku pozostawiam 'FREE', dopóki student nie zostanie zatwierdzony i dodany do `thesis.students` thesis.status = 'PENDING_APPROVAL'; 
            // Opcjonalnie, jeśli chcesz by praca zmieniała status na 'oczekująca'  await thesis.save({ session });
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({
                message: 'Twoje zgłoszenie zapisu na pracę dyplomową zostało wysłane do promotora i oczekuje na zatwierdzenie.',
                requestId: newRequest._id
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Błąd podczas zapisywania studenta na pracę dyplomową:', error);
            res.status(500).json({ message: 'Wystąpił błąd serwera.' });
        }
    } catch (error) {
        console.error('Błąd podczas zapisywania studenta na pracę dyplomową:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// POST /theses/{id}/approve-student 
// Promotor zatwierdza studenta dla danej pracy
router.post('/:id/approve-student', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        const { studentId, requestId } = req.body; 
        const userRole = req.user!.role;
        const loggedInUserId = req.user!._id;
        if (userRole !== 'SUPERVISOR' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do zatwierdzania studentów.' });
        }
        if (!mongoose.Types.ObjectId.isValid(thesisId) || !mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej, studenta lub zgłoszenia.' });
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const thesis: IThesis | null = await Thesis.findById(thesisId).session(session);
            if (!thesis) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
            }
            if (thesis.supervisor.toString() !== loggedInUserId.toString() && userRole !== 'ADMIN') {
                await session.abortTransaction();
                return res.status(403).json({ message: 'Nie jesteś promotorem tej pracy dyplomowej.' });
            }
            if (thesis.students.includes(new mongoose.Types.ObjectId(studentId))) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Student jest już zatwierdzony dla tej pracy dyplomowej.' });
            }
            if (thesis.students.length >= thesis.studentsLimit) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Praca dyplomowa osiągnęła maksymalną liczbę studentów.' });
            }
            const RequestModel = mongoose.model('Request');
            const requestToUpdate: any = await RequestModel.findById(requestId).session(session);
            if (!requestToUpdate || requestToUpdate.student.toString() !== studentId.toString() || requestToUpdate.thesis.toString() !== thesisId.toString() || requestToUpdate.status !== 'PENDING') {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Nie znaleziono oczekującego zgłoszenia lub jest ono nieprawidłowe.' });
            }
            requestToUpdate.status = 'APPROVED';
            await requestToUpdate.save({ session });
            thesis.students.push(new mongoose.Types.ObjectId(studentId));
            if (thesis.students.length === 1) {
                thesis.status = 'TAKEN';
            }
            await thesis.save({ session });
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({ message: 'Student został pomyślnie zatwierdzony dla pracy dyplomowej.', thesis });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Błąd podczas zatwierdzania studenta:', error);
            res.status(500).json({ message: 'Wystąpił błąd serwera.' });
        }
    } catch (error) {
        console.error('Błąd podczas zatwierdzania studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// POST /theses/{id}/reject-student 
// Promotor odrzuca studenta dla danej pracy
router.post('/:id/reject-student', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        const { studentId, requestId } = req.body; 
        const userRole = req.user!.role;
        const loggedInUserId = req.user!._id;
        if (userRole !== 'SUPERVISOR' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do odrzucania studentów.' });
        }
        if (!mongoose.Types.ObjectId.isValid(thesisId) || !mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej, studenta lub zgłoszenia.' });
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const thesis: IThesis | null = await Thesis.findById(thesisId).session(session);
            if (!thesis) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
            }
            if (thesis.supervisor.toString() !== loggedInUserId.toString() && userRole !== 'ADMIN') {
                await session.abortTransaction();
                return res.status(403).json({ message: 'Nie jesteś promotorem tej pracy dyplomowej.' });
            }
            const RequestModel = mongoose.model('Request');
            const requestToUpdate: any = await RequestModel.findById(requestId).session(session);
            if (!requestToUpdate || requestToUpdate.student.toString() !== studentId.toString() || requestToUpdate.thesis.toString() !== thesisId.toString() || requestToUpdate.status !== 'PENDING') {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Nie znaleziono oczekującego zgłoszenia lub jest ono nieprawidłowe.' });
            }
            requestToUpdate.status = 'REJECTED';
            await requestToUpdate.save({ session });
            await session.commitTransaction();
            session.endSession();
            res.status(200).json({ message: 'Zgłoszenie studenta zostało odrzucone.' });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Błąd podczas odrzucania studenta:', error);
            res.status(500).json({ message: 'Wystąpił błąd serwera.' });
        }
    } catch (error) {
        console.error('Błąd podczas odrzucania studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});


// PUT /Theses/{id}
// Aktualizuj pracę dyplomową o podanym ID (dostępne tylko dla promotorów i administratorów)
router.put('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        const userRole = req.user!.role;
        const loggedInUserId = req.user!._id;
        const { students: newStudentsIds, ...updateData } = req.body; 
        if (userRole !== 'SUPERVISOR' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do aktualizacji pracy dyplomowej.' });
        }
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }
        const thesisToUpdate: IThesis | null = await Thesis.findById(thesisId);
        if (!thesisToUpdate) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }
        if (userRole === 'SUPERVISOR' && thesisToUpdate.supervisor.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: 'Promotor może aktualizować tylko swoje prace dyplomowe.' });
        }

        // Obsługa aktualizacji studentów - ten PUT niech służy do ogólnej edycji
        // Przypisywanie/zatwierdzanie studentów będzie osobnym endpointem POST /theses/{id}/assign-student (lub podobnym)
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

// DELETE /Theses/{id}
// Usuń pracę dyplomową o podanym ID (dostępne tylko dla administratorów)
router.delete('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const thesisId = req.params.id;
        const userRole = req.user!.role;
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do usunięcia pracy dyplomowej.' });
        }
        if (!mongoose.Types.ObjectId.isValid(thesisId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID pracy dyplomowej.' });
        }
        const thesisToDelete: IThesis | null = await Thesis.findById(thesisId);
        if (!thesisToDelete) {
            return res.status(404).json({ message: 'Nie znaleziono pracy dyplomowej.' });
        }
        const supervisorProfile: ISupervisor | null = await Supervisor.findById(thesisToDelete.supervisor);
        if (supervisorProfile) {
            supervisorProfile.thesisList = supervisorProfile.thesisList.filter(id => id.toString() !== thesisId);
            await supervisorProfile.save();
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