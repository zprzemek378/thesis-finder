// src/middleware/auth.ts
import { Request, NextFunction } from "express";
import { verifyAccessToken as verifyAccessTokenUtil } from "../utils/jwt";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: Partial<IUser>;
}

export async function verifyAccessTokenMiddleware(
  req: any,
  res: any,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader);
  
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("No Bearer token found");
    res.status(401).json({ message: "Brak tokena" });
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token ? "exists" : "missing");
  
  try {
    // Weryfikacja tokenu i przypisanie użytkownika do req.user
    const payload = verifyAccessTokenUtil(token);
    console.log("Token payload:", payload);

    // Jeśli payload jest typu JwtPayload, możesz bezpiecznie przypisać go do req.user
    // if (typeof payload !== "string") {
    //   req.user = payload as Partial<IUser>;
    // }

    // Jeśli payload jest typu JwtPayload, przypisz dane z tokena do req.user
    if (typeof payload !== "string" && payload.sub) {
      req.user = {
        _id: payload.sub,
        role: payload.role,
      };
    }

    next();
  } catch {
    res.status(403).json({ message: "Nieprawidłowy token" });
  }
}
