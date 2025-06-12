import { Router, Request, Response, NextFunction } from "express";
import { verifyAccessTokenMiddleware } from "../middlewares/auth";
import Supervisor, { ISupervisor } from "../models/Supervisor";
import Thesis, { IThesis } from "../models/Thesis";
import RequestModel, { IRequest } from "../models/Request";
import mongoose from "mongoose";
import User from "../models/User";

const router = Router();

// GET /Supervisors
// Pobierz listę wszystkich promotorów
router.get(
  "/",
  verifyAccessTokenMiddleware,
  async (req: Request, res: Response) => {
    try {
      const supervisors: ISupervisor[] = await Supervisor.find();

      // Pobierz dane użytkowników dla wszystkich promotorów
      const supervisorsWithUsers = await Promise.all(
        supervisors.map(async (supervisor) => {
          const supervisorUser = await User.findOne({
            supervisor: supervisor._id,
          });

          return {
            ...supervisor.toObject(),
            user: supervisorUser ? supervisorUser.toObject() : null,
          };
        })
      );

      res.status(200).json(supervisorsWithUsers);
    } catch (error) {
      console.error("Błąd podczas pobierania listy promotorów:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Supervisors/{id}
// Pobierz promotora po ID
router.get(
  "/:id",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const supervisorId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }
      const supervisor: ISupervisor | null = await Supervisor.findById(
        supervisorId
      );
      if (!supervisor) {
        return res.status(404).json({ message: "Nie znaleziono promotora." });
      }
      res.status(200).json(supervisor);
    } catch (error) {
      console.error("Błąd podczas pobierania promotora po ID:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Supervisors/{id}/theses
// Pobierz prace dyplomowe promotora o podanym ID
router.get(
  "/:id/theses",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const supervisorId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }
      const theses: IThesis[] = await Thesis.find({ supervisor: supervisorId });
      res.status(200).json(theses);
    } catch (error) {
      console.error(
        "Błąd podczas pobierania prac dyplomowych promotora:",
        error
      );
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Supervisors/{id}/requests
// Pobierz listę zapytań (propozycji prac) od studentów do promotora o podanym ID
router.get(
  "/:id/requests",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const supervisorId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }

      const requests: IRequest[] = await RequestModel.find({
        supervisor: supervisorId,
      }).populate("student");

      const requestsWithUser = await Promise.all(
        requests.map(async (req) => {
          if (!req.student) {
            return {
              ...req.toObject(),
              studentUser: null,
            };
          }
          const user = await User.findOne({ student: req.student._id });
          return {
            ...req.toObject(),
            studentUser: user,
          };
        })
      );

      res.status(200).json(requestsWithUser);
    } catch (error) {
      console.error("Błąd podczas pobierania zapytań do promotora:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// GET /Supervisors/{id}/availability
// Pobierz informacje o dostępności promotora
router.get(
  "/:id/availability",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const supervisorId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }
      const supervisor: ISupervisor | null = await Supervisor.findById(
        supervisorId
      );
      if (!supervisor) {
        return res.status(404).json({ message: "Nie znaleziono promotora." });
      }
      res.status(200).json({ availability: supervisor!.availability });
    } catch (error) {
      console.error("Błąd podczas pobierania dostępności promotora:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// PUT /Supervisors/{id}
// Aktualizuj dane promotora o podanym ID (tylko dla administratora)
router.put(
  "/:id",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const supervisorId = req.params.id;
      const userRole = req.user!.role;
      if (userRole !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Brak uprawnień do aktualizacji promotora." });
      }

      if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }

      const updateData: Partial<ISupervisor> = req.body;
      const updatedSupervisor: ISupervisor | null =
        await Supervisor.findByIdAndUpdate(supervisorId, updateData, {
          new: true,
        });

      if (!updatedSupervisor) {
        return res.status(404).json({ message: "Nie znaleziono promotora." });
      }

      res.status(200).json(updatedSupervisor);
    } catch (error) {
      console.error("Błąd podczas aktualizacji promotora:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

// DELETE /Supervisors/{id}
// Usuń promotora o podanym ID (dostępne tylko dla administratora)
router.delete(
  "/:id",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const supervisorId = req.params.id;
      const userRole = req.user!.role;
      if (userRole !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Brak uprawnień do usunięcia promotora." });
      }

      if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy format ID promotora." });
      }

      const deletedSupervisor: ISupervisor | null =
        await Supervisor.findByIdAndDelete(supervisorId);

      if (!deletedSupervisor) {
        return res.status(404).json({ message: "Nie znaleziono promotora." });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Błąd podczas usuwania promotora:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

export default router;
