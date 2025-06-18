// src/routes/auth.ts
import { Router, Request, NextFunction } from "express";
import User, { IUser } from "../models/User";
import Student from "../models/Student";
import Supervisor from "../models/Supervisor";
import { verifyAccessTokenMiddleware } from "../middlewares/auth";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const router = Router();

// POST /register
// Rejestracja nowego użytkownika
router.post("/register", async (req: any, res: any) => {
  const {
    firstName,
    lastName,
    email,
    password,
    faculty,
    role,
    studentData,
    supervisorData,
  } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email zajęty" });

    // Tworzymy pusty obiekt, żeby przypisać ID po kolei
    let studentId = null;
    let supervisorId = null;

    // Tworzymy użytkownika jako pierwszy krok
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      faculty,
      role,
      chats: [],
    });

    // Student
    if (role === "STUDENT" && studentData) {
      const newStudent = await Student.create(studentData);
      studentId = newStudent._id;

      // Dodajemy referencję w User
      user.student = studentId as any; // <-- KLUCZOWE
      await user.save();
    }

    // Supervisor
    if (role === "SUPERVISOR" && supervisorData) {
      const newSupervisor = await Supervisor.create({
        ...supervisorData,
        userId: user._id, // <-- KLUCZOWE
      });
      supervisorId = newSupervisor._id;

      // Dodajemy referencję w User
      user.supervisor = supervisorId as any;
      await user.save();
    }

    res.status(201).json({ id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

// POST /login
// Logowanie użytkownika
router.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.warn(`Użytkownik o emailu ${email} nie istnieje`);
      return res
        .status(401)
        .json({ message: "Nieprawidłowe dane logowania (email)" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      console.warn(`Nieprawidłowe hasło dla użytkownika ${email}`);
      return res
        .status(401)
        .json({ message: "Nieprawidłowe dane logowania (hasło)" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Prepare user data to send (excluding sensitive information)
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
      supervisor: user.supervisor,
      student: user.student,
    };

    res
      .cookie("jid", refreshToken, { httpOnly: true, path: "/auth/refresh" })
      .json({
        accessToken,
        user: userData,
      });
  } catch (error: any) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).json({
      message: "Błąd serwera",
      error: error.message || "Nieznany błąd",
    });
  }
});

// POST /refresh
// Odświeżanie tokena
router.post("/refresh", async (req: any, res: any) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ message: "Brak tokena" });

  try {
    const payload = verifyRefreshToken(token) as any;
    const user = await User.findById(payload.sub);
    if (!user) throw new Error();

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    res
      .cookie("jid", newRefresh, { httpOnly: true, path: "/auth/refresh" })
      .json({ accessToken: newAccess });
  } catch {
    res.clearCookie("jid", { path: "/auth/refresh" });
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// POST /logout
// Wylogowanie użytkownika
router.post("/logout", (_req, res) => {
  res.clearCookie("jid", { path: "/auth/refresh" }).json({ success: true });
});

// GET /auth/me
// Pobranie informacji o zalogowanym użytkowniku
router.get(
  "/me",
  verifyAccessTokenMiddleware,
  async (req: any, res: any, next: NextFunction) => {
    try {
      const userId = (req.user as IUser)?._id;
      if (!userId) {
        return res.status(401).json({ message: "Nieautoryzowany dostęp." });
      }

      const user: IUser | null = await User.findById(userId)
        .select("-password")
        .populate("student")
        .populate("supervisor");
      if (!user) {
        return res.status(404).json({ message: "Nie znaleziono użytkownika." });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o użytkowniku:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera." });
    }
  }
);

export default router;
