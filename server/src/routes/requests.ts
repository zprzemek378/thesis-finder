import { Router, Request, NextFunction } from "express";
import { verifyAccessTokenMiddleware } from "../middlewares/auth";
import mongoose from "mongoose";
import RequestModel, { IRequest } from "../models/Request";
import Message, { IMessage } from "../models/Message";
import User from "../models/User";

const router = Router();

// GET /Requests/students/{studentId}
// Pobierz listę zgłoszeń studenta o podanym ID
router.get(
  "/students/:studentId",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const studentId = req.params.studentId;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID studenta." });
      }

      const requests: IRequest[] = await RequestModel.find({
        student: studentId,
      })
        .populate("supervisor")
        .populate("student");

      res.status(200).json(requests);
    } catch (error) {
      console.error("Błąd podczas pobierania zgłoszeń studenta:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Requests/supervisors/{supervisorId}
// Pobierz listę zgłoszeń dla promotora o podanym ID
router.get(
  "/supervisors/:supervisorId",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const supervisorId = req.params.supervisorId;

      if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }

      const requests: IRequest[] = await RequestModel.find({
        supervisor: supervisorId,
      })
        .populate("student")
        .populate("supervisor");

      res.status(200).json(requests);
    } catch (error) {
      console.error("Błąd podczas pobierania zgłoszeń dla promotora:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Requests/{id}/status
// Pobierz status zgłoszenia o podanym ID
router.get(
  "/:id/status",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const requestId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID zgłoszenia." });
      }

      const request: IRequest | null = await RequestModel.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Nie znaleziono zgłoszenia." });
      }

      res.status(200).json({ status: request.status });
    } catch (error) {
      console.error("Błąd podczas pobierania statusu zgłoszenia:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Requests/{id}/messages
// Pobierz listę wiadomości związanych ze zgłoszeniem o podanym ID
router.get(
  "/:id/messages",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const requestId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID zgłoszenia." });
      }

      const messages: IMessage[] = await Message.find({
        request: requestId,
      }).populate("sender");

      res.status(200).json(messages);
    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości zgłoszenia:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// POST /Requests
// Stwórz nowe zgłoszenie
router.post(
  "/Requests",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const userId = req.user!._id;
      const { supervisor, thesisTitle, description, thesisId } = req.body;

      if (!supervisor || !thesisTitle || !description || !thesisId) {
        return res.status(400).json({ message: "Wszystkie pola są wymagane." });
      }

      if (!mongoose.Types.ObjectId.isValid(supervisor)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }

      const user = await User.findById(userId).populate("student");

      if (!user || !user.student) {
        return res
          .status(404)
          .json({ message: "Nie znaleziono profilu studenta." });
      }

      const newRequest: IRequest = new RequestModel({
        student: user.student,
        supervisor,
        content: `${thesisTitle}\n\n${description}`,
        status: "PENDING",
        type: "THESIS_ENROLLMENT",
        thesisId,
      });

      const savedRequest = await newRequest.save();

      res.status(201).json(savedRequest);
    } catch (error) {
      console.error("Błąd podczas tworzenia zgłoszenia:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// PUT /Requests/{id}/status
// Aktualizuj status zgłoszenia o podanym ID
router.put(
  "/:id/status",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const requestId = req.params.id;
      const { status, thesisId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID zgłoszenia." });
      }

      const allowedStatuses = [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "IN_PROGRESS",
        "COMPLETED",
      ];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy status zgłoszenia." });
      }

      const updatedRequest: IRequest | null =
        await RequestModel.findByIdAndUpdate(
          requestId,
          { status },
          { new: true }
        )
          .populate("supervisor")
          .populate("student");

      if (!updatedRequest) {
        return res.status(404).json({ message: "Nie znaleziono zgłoszenia." });
      }

      if (status === "APPROVED") {
        const studentId = updatedRequest.student?._id;

        console.log(studentId, thesisId);

        if (thesisId && studentId) {
          const Thesis = require("../models/Thesis").default;
          const thesis = await Thesis.findById(thesisId);

          if (thesis) {
            if (!thesis.students.includes(studentId)) {
              thesis.students.push(studentId);
              await thesis.save();
            }
          }
        }
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Błąd podczas aktualizacji statusu zgłoszenia:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Requests/{id}/status
// Pobierz status zgłoszenia o podanym ID
router.get(
  "/:id/status",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const requestId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID zgłoszenia." });
      }

      const request: IRequest | null = await RequestModel.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Nie znaleziono zgłoszenia." });
      }

      res.status(200).json({ status: request.status });
    } catch (error) {
      console.error("Błąd podczas pobierania statusu zgłoszenia:", error);
      next(error);
    }
  }
);

// GET /Requests/{id}/messages
// Pobierz wszystkie wiadomości dla zgłoszenia o podanym ID
router.get(
  "/:id/messages",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const requestId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID zgłoszenia." });
      }

      const request: IRequest | null = await RequestModel.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Nie znaleziono zgłoszenia." });
      }

      const messages: IMessage[] = await Message.find({ request: requestId })
        .populate("author")
        .sort({ date: 1 });

      res.status(200).json(messages);
    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości zgłoszenia:", error);
      next(error);
    }
  }
);

// DELETE /Requests/{id}
// Usuń zgłoszenie o podanym ID
router.delete(
  "/:id",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const requestId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID zgłoszenia." });
      }

      const deletedRequest: IRequest | null =
        await RequestModel.findByIdAndDelete(requestId);
      if (!deletedRequest) {
        return res.status(404).json({ message: "Nie znaleziono zgłoszenia." });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Błąd podczas usuwania zgłoszenia:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

export default router;
