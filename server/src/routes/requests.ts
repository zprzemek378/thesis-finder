import { Router, Request, NextFunction } from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/auth';
import mongoose from 'mongoose';
import RequestModel, { IRequest } from '../models/Request';
import Message, { IMessage } from '../models/Message';

const router = Router();

// NOWE - GET /Requests/students/{studentId}
// Pobierz listę zgłoszeń studenta o podanym ID
router.get('/students/:studentId', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const studentId = req.params.studentId;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID studenta.' });
        }

        const requests: IRequest[] = await RequestModel.find({ student: studentId })
            .populate('supervisor')
            .populate('student'); // Populate supervisor and student details

        res.status(200).json(requests);

    } catch (error) {
        console.error('Błąd podczas pobierania zgłoszeń studenta:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - GET /Requests/supervisors/{supervisorId}
// Pobierz listę zgłoszeń dla promotora o podanym ID
router.get('/supervisors/:supervisorId', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const supervisorId = req.params.supervisorId;

        if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID promotora.' });
        }

        const requests: IRequest[] = await RequestModel.find({ supervisor: supervisorId })
            .populate('student')
            .populate('supervisor'); // Populate student and supervisor details

        res.status(200).json(requests);

    } catch (error) {
        console.error('Błąd podczas pobierania zgłoszeń dla promotora:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - GET /Requests/{id}/status
// Pobierz status zgłoszenia o podanym ID
router.get('/:id/status', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const requestId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
        }

        const request: IRequest | null = await RequestModel.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Nie znaleziono zgłoszenia.' });
        }

        res.status(200).json({ status: request.status });

    } catch (error) {
        console.error('Błąd podczas pobierania statusu zgłoszenia:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - GET /Requests/{id}/messages
// Pobierz listę wiadomości związanych ze zgłoszeniem o podanym ID
router.get('/:id/messages', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const requestId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
        }

        // Assuming you have a Message model and each message has a 'request' field referencing the Request
        const messages: IMessage[] = await Message.find({ request: requestId })
            .populate('sender'); // Populate sender details (if needed)

        res.status(200).json(messages);

    } catch (error) {
        console.error('Błąd podczas pobierania wiadomości zgłoszenia:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - POST /Requests (Create a new request)
router.post('/Requests', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const studentId = req.user!._id; // Get student ID from the authenticated user
        const { supervisor, thesisTitle, description } = req.body;

        // Validate data
        if (!supervisor || !thesisTitle || !description) {
            return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
        }

        if (!mongoose.Types.ObjectId.isValid(supervisor)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID promotora.' });
        }

        // Create new request
        const newRequest: IRequest = new RequestModel({
            student: studentId,
            supervisor,
            thesisTitle,
            description,
            status: 'pending' // Initial status
        });

        // Save request to database
        const savedRequest = await newRequest.save();

        res.status(201).json(savedRequest); // Return the created request

    } catch (error) {
        console.error('Błąd podczas tworzenia zgłoszenia:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - PUT /Requests/{id}/status
// Aktualizuj status zgłoszenia o podanym ID
router.put('/:id/status', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const requestId = req.params.id;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
        }

        // Validate status (assuming you have an enum or a set of allowed status values)
        const allowedStatuses = ['pending', 'approved', 'rejected', 'in_progress', 'completed']; // Example statuses
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Nieprawidłowy status zgłoszenia.' });
        }

        const updatedRequest: IRequest | null = await RequestModel.findByIdAndUpdate(requestId, { status }, { new: true })
            .populate('supervisor')
            .populate('student'); // Populate details after update

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Nie znaleziono zgłoszenia.' });
        }

        res.status(200).json(updatedRequest);

    } catch (error) {
        console.error('Błąd podczas aktualizacji statusu zgłoszenia:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// NOWE - DELETE /Requests/{id}
// Usuń zgłoszenie o podanym ID
router.delete('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const requestId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
        }

        const deletedRequest: IRequest | null = await RequestModel.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(404).json({ message: 'Nie znaleziono zgłoszenia.' });
        }

        res.status(204).send();

    } catch (error) {
        console.error('Błąd podczas usuwania zgłoszenia:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;