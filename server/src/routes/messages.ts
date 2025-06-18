// src/routes/messages.ts
import { Router, NextFunction } from 'express';
import { verifyAccessTokenMiddleware, AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';
import MessageModel, { IMessage } from '../models/Message';
import ChatModel, { IChat } from '../models/Chat'; 
import RequestModel, { IRequest } from '../models/Request';
import User, { IUser } from '../models/User'; 

const router = Router();

// GET /messages/request/{requestId}
// Pobierz listę wszystkich wiadomości dla danego ID zgłoszenia
router.get('/request/:requestId', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const requestId = req.params.requestId;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
        }

        // Sprawdźenie dostępu użytkownika do tego zgłoszenia (np. jest autorem, studentem lub promotorem)
        const requestDoc: IRequest | null = await RequestModel.findById(requestId);
        if (!requestDoc) {
            return res.status(404).json({ message: 'Zgłoszenie nie znalezione.' });
        }

        const loggedInUserId = req.user!._id;
        const userRole = req.user!.role;

        // Autoryzacja: Administrator, student przypisany do zgłoszenia, lub promotor przypisany do zgłoszenia
        if (userRole !== 'ADMIN' &&
            requestDoc.student?.toString() !== loggedInUserId.toString() &&
            requestDoc.supervisor?.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: 'Brak uprawnień do przeglądania wiadomości tego zgłoszenia.' });
        }

        const messages: IMessage[] = await MessageModel.find({ request: requestId })
            .populate('author', 'firstName lastName email') 
            .sort({ date: 1 }); 

        const formattedMessages = messages.map(msg => {
            const author = msg.author as IUser;
            return {
                _id: msg._id,
                content: msg.content,
                date: msg.date,
                author: author ? `${author.firstName} ${author.lastName}` : 'Nieznany',
                authorId: author ? author._id : null,
                sentByMe: author ? author._id.toString() === loggedInUserId.toString() : false
            };
        });

        res.status(200).json(formattedMessages);

    } catch (error) {
        console.error('Błąd podczas pobierania wiadomości dla zgłoszenia:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// POST /messages
// Dodanie nowej wiadomości do zgłoszenia lub do czatu 
router.post('/', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const authorId = req.user!._id;
        const { content, request, chat } = req.body;

        if (!request && !chat) {
            return res.status(400).json({ message: 'Wiadomość musi być przypisana do zgłoszenia (request) lub czatu (chat).' });
        }
        if (request && chat) {
            return res.status(400).json({ message: 'Wiadomość nie może być przypisana jednocześnie do zgłoszenia i czatu.' });
        }
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Treść wiadomości nie może być pusta.' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let parentDoc: IRequest | IChat | null = null;

            if (request) {
                if (!mongoose.Types.ObjectId.isValid(request)) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: 'Nieprawidłowy format ID zgłoszenia.' });
                }
                parentDoc = await RequestModel.findById(request).session(session);
                if (!parentDoc) {
                    await session.abortTransaction();
                    return res.status(404).json({ message: 'Zgłoszenie nie znaleziono.' });
                }
                if (parentDoc.student?.toString() !== authorId.toString() &&
                    parentDoc.supervisor?.toString() !== authorId.toString() &&
                    req.user!.role !== 'ADMIN') {
                    await session.abortTransaction();
                    return res.status(403).json({ message: 'Brak uprawnień do wysyłania wiadomości w tym zgłoszeniu.' });
                }

            } else if (chat) {
                if (!mongoose.Types.ObjectId.isValid(chat)) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: 'Nieprawidłowy format ID czatu.' });
                }
                parentDoc = await ChatModel.findById(chat).session(session);
                if (!parentDoc) {
                    await session.abortTransaction();
                    return res.status(404).json({ message: 'Czat nie znaleziono.' });
                }
                if (!(parentDoc as IChat).members.some(memberId => memberId.toString() === authorId.toString())) {
                    await session.abortTransaction();
                    return res.status(403).json({ message: 'Nie jesteś członkiem tego czatu.' });
                }
            } else {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Nie podano ID zgłoszenia ani ID czatu.' });
            }

            const newMessage: IMessage = new MessageModel({
                author: authorId,
                content,
                date: new Date(),
                request: request ? new mongoose.Types.ObjectId(request) : undefined,
                chat: chat ? new mongoose.Types.ObjectId(chat) : undefined,
            });

            const savedMessage = await newMessage.save({ session });

            if (chat && parentDoc && (parentDoc as IChat)._id) { 
                await ChatModel.findByIdAndUpdate(
                    (parentDoc as IChat)._id,
                    {
                        lastMessage: savedMessage._id,
                        lastMessageDate: savedMessage.date
                    },
                    { session }
                );
            }

            await session.commitTransaction();
            session.endSession();

            const populatedMessage = await savedMessage.populate('author', 'firstName lastName email');

            res.status(201).json(populatedMessage);

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Błąd podczas dodawania wiadomości:', error);
            res.status(500).json({ message: 'Wystąpił błąd serwera.' });
        }
    } catch (error) {
        console.error('Błąd podczas dodawania wiadomości:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});


// DELETE /Messages/{id}
// Usunięcie wiadomości o podanym ID (tylko dla autora wiadomości lub administratora)
router.delete('/:id', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
    try {
        const messageId = req.params.id;
        const loggedInUserId = req.user!._id;
        const userRole = req.user!.role;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ message: 'Nieprawidłowy format ID wiadomości.' });
        }

        const messageToDelete: IMessage | null = await MessageModel.findById(messageId);

        if (!messageToDelete) {
            return res.status(404).json({ message: 'Nie znaleziono wiadomości.' });
        }

        if (messageToDelete.author.toString() !== loggedInUserId.toString() && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Brak uprawnień do usunięcia tej wiadomości.' });
        }

        const deletedMessage: IMessage | null = await MessageModel.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Nie znaleziono wiadomości.' });
        }

        res.status(204).send(); 

    } catch (error) {
        console.error('Błąd podczas usuwania wiadomości:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

export default router;