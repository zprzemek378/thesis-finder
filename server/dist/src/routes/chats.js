"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/chats.ts
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const mongoose_1 = __importDefault(require("mongoose"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// POST /chats
// Tworzy nowy pokój rozmów (chat) między określonymi użytkownikami
router.post("/", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const { members, title } = req.body;
        console.log(members, title);
        const loggedInUserId = req.user._id;
        if (!Array.isArray(members) || members.length < 2) {
            return res
                .status(400)
                .json({ message: "Czat musi mieć co najmniej dwóch członków." });
        }
        if (!members.some((memberId) => memberId.toString() === loggedInUserId.toString())) {
            return res
                .status(403)
                .json({ message: "Musisz być członkiem tworzonego czatu." });
        }
        const validMemberObjectIds = [];
        for (const id of members) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res
                    .status(400)
                    .json({ message: `Nieprawidłowy format ID członka: ${id}.` });
            }
            validMemberObjectIds.push(new mongoose_1.default.Types.ObjectId(id));
        }
        const existingUsers = await User_1.default.find({
            _id: { $in: validMemberObjectIds },
        });
        if (existingUsers.length !== validMemberObjectIds.length) {
            return res
                .status(404)
                .json({ message: "Jeden lub więcej użytkowników nie istnieje." });
        }
        if (members.length === 2) {
            const sortedMembers = validMemberObjectIds
                .map((id) => id.toString())
                .sort();
            const existingChat = await Chat_1.default.findOne({
                members: { $all: sortedMembers, $size: 2 },
            });
            if (existingChat) {
                return res
                    .status(409)
                    .json({
                    message: "Czat między tymi użytkownikami już istnieje.",
                    chat: existingChat,
                });
            }
        }
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const newChat = new Chat_1.default({
                members: validMemberObjectIds,
                title: title,
                // readStatuses
            });
            const savedChat = await newChat.save({ session });
            for (const memberId of validMemberObjectIds) {
                await User_1.default.findByIdAndUpdate(memberId, { $addToSet: { chats: savedChat._id } }, { session });
            }
            await session.commitTransaction();
            session.endSession();
            const populatedChat = await Chat_1.default.findById(savedChat._id).populate("members", "firstName lastName email");
            res.status(201).json(populatedChat);
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Błąd podczas tworzenia czatu:", error);
            res.status(500).json({ message: "Wystąpił błąd serwera." });
        }
    }
    catch (error) {
        console.error("Błąd podczas tworzenia czatu:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// GET /chats/my-conversations
// Pobierz listę konwersacji dla zalogowanego użytkownika, wraz z ostatnią wiadomością
router.get("/my-conversations", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;
        const chats = await Chat_1.default.find({ members: loggedInUserId })
            .populate("members", "firstName lastName email")
            .populate("lastMessage")
            .populate("lastMessage.author", "firstName lastName");
        const formattedConversations = chats.map((chat) => {
            const otherMember = chat.members.find((member) => member._id && member._id.toString() !== loggedInUserId.toString());
            const chatName = otherMember && chat.members.length === 2
                ? `${otherMember.firstName} ${otherMember.lastName}`
                : chat.title || "Czat grupowy";
            const lastMsg = chat.lastMessage;
            return {
                chatId: chat._id,
                name: chatName,
                lastMessage: lastMsg ? lastMsg.content : "Brak wiadomości",
                lastMessageDate: chat.lastMessageDate,
            };
        });
        res.status(200).json(formattedConversations);
    }
    catch (error) {
        console.error("Błąd podczas pobierania konwersacji:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
// GET /chats/{chatId}/messages
// Pobierz wszystkie wiadomości dla określonego czatu.
router.get("/:chatId/messages", auth_1.verifyAccessTokenMiddleware, async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const loggedInUserId = req.user._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(chatId)) {
            return res
                .status(400)
                .json({ message: "Nieprawidłowy format ID czatu." });
        }
        const chat = await Chat_1.default.findById(chatId).populate("members", "firstName lastName email");
        if (!chat) {
            return res.status(404).json({ message: "Nie znaleziono czatu." });
        }
        const isMember = chat.members.some((member) => member._id.toString() === loggedInUserId.toString());
        if (!isMember) {
            return res
                .status(403)
                .json({ message: "Nie masz dostępu do tego czatu." });
        }
        const messages = await Message_1.default.find({ chat: chatId })
            .populate("author", "firstName lastName email")
            .sort({ date: 1 });
        const formattedConversation = messages.map((msg) => {
            const author = msg.author;
            return {
                _id: msg._id,
                content: msg.content,
                date: msg.date,
                author: author
                    ? `${author.firstName} ${author.lastName}`
                    : "Nieznany",
                authorId: author ? author._id : null,
                sentByMe: author
                    ? author._id.toString() === loggedInUserId.toString()
                    : false,
            };
        });
        res.status(200).json(formattedConversation);
    }
    catch (error) {
        console.error("Błąd podczas pobierania wiadomości czatu:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
});
exports.default = router;
