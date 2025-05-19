// src/routes/auth.ts
import { Router, Request, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { verifyAccessTokenMiddleware } from '../middlewares/auth';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

const router = Router();

// Rejestracja
import Student from '../models/Student';
import Supervisor from '../models/Supervisor';

router.post('/register', async (req: any, res: any) => {
  const { firstName, lastName, email, password, faculty, role, studentData, supervisorData } = req.body;
  console.log("Request body:", req.body); 

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email zajęty' });

    let studentId = null;
    let supervisorId = null;

    // Dodanie studenta jeśli są dane
    if (role === 'STUDENT' && studentData) {
      const newStudent = await Student.create(studentData);
      studentId = newStudent._id;
    }

    // Dodanie promotora jeśli są dane
    if (role === 'SUPERVISOR' && supervisorData) {
      const newSupervisor = await Supervisor.create(supervisorData);
      supervisorId = newSupervisor._id;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      faculty,
      role,
      student: studentId,
      supervisor: supervisorId,
      chats: [], // pusta tablica
    });

    res.status(201).json({ id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

  

// Logowanie
router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Nieprawidłowe dane' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // wysyłamy access jako JSON, refresh w cookie http-only:
    res
      .cookie('jid', refreshToken, { httpOnly: true, path: '/auth/refresh' })
      .json({ accessToken });
  } catch {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Odświeżanie tokena
router.post('/refresh', async (req: any, res: any) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ message: 'Brak tokena' });

  try {
    const payload = verifyRefreshToken(token) as any;
    const user = await User.findById(payload.sub);
    if (!user) throw new Error();

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    res
      .cookie('jid', newRefresh, { httpOnly: true, path: '/auth/refresh' })
      .json({ accessToken: newAccess });
  } catch {
    res.clearCookie('jid', { path: '/auth/refresh' });
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Wylogowanie
router.post('/logout', (_req, res) => {
  res.clearCookie('jid', { path: '/auth/refresh' }).json({ success: true });
});

// NOWE - GET /auth/me
// Pobranie informacji o zalogowanym użytkowniku
router.get('/me', verifyAccessTokenMiddleware, async (req: any, res: any, next: NextFunction) => {
  try {
    // Type assertion to tell TypeScript that req.user is definitely an IUser
    const userId = (req.user as IUser)?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Nieautoryzowany dostęp.' });
    }

    // Znajdź pełne dane użytkownika w bazie danych, wykluczając hasło
    const user: IUser | null = await User.findById(userId).select('-password'); // Explicitly type user as IUser | null

    if (!user) {
      return res.status(404).json({ message: 'Nie znaleziono użytkownika.' });
    }

    // Zwróć dane użytkownika
    res.status(200).json(user);

  } catch (error) {
    console.error('Błąd podczas pobierania informacji o użytkowniku:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

export default router;