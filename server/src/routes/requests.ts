import { Router, Request, Response, NextFunction } from 'express';
import { verifyAccessTokenMiddleware, AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';
import RequestModel, { IRequest } from '../models/Request';

const router = Router();

// NOWE - POST /Requests (Create a new request)
router.post('/Requests', verifyAccessTokenMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
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

export default router;
