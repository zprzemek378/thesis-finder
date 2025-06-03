import { Router, Request, NextFunction } from 'express';
import { verifyAccessTokenMiddleware } from '../middlewares/auth';
import mongoose from 'mongoose';
import MessageModel, { IMessage } from '../models/Message';

const router = Router();

// GET /Messages/request/{requestId}
// Pobierz listę wszystkich wiadomości dla danego ID zgłoszenia
router.get('/request/:requestId', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const requestId = req.params.requestId;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
        }

        const messages: IMessage[] = await MessageModel.find({ request: requestId })
            .populate('author'); 

        res.status(200).json(messages);

    } catch (error) {
        console.error('Błąd podczas pobierania wiadomości dla zgłoszenia:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// POST /Messages
// Dodaj nową wiadomość do zgłoszenia
router.post('/', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const authorId = req.user!._id; 
        const { request, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(request)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
        }

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Treść wiadomości nie może być pusta.' });
        }

        const newMessage: IMessage = new MessageModel({
            author: authorId,
            content,
            request,
            date: new Date()
        });

        const savedMessage = await newMessage.save();

        const populatedMessage = await savedMessage.populate('author');

        res.status(201).json(populatedMessage);

    } catch (error) {
        console.error('Błąd podczas dodawania nowej wiadomości:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;