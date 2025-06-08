// src/utils/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';

const jwtSecret = process.env.JWT_SECRET as string;
const refreshSecret = process.env.REFRESH_SECRET || jwtSecret;


const accessTokenOptions: SignOptions = {
  expiresIn: process.env.JWT_EXPIRES as any|| '15m'
};

const refreshTokenOptions: SignOptions = {
  expiresIn: process.env.REFRESH_EXPIRES as any|| '7d'
};

export function signAccessToken(user: IUser): string {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    jwtSecret,
    accessTokenOptions
  );
}

export function signRefreshToken(user: IUser): string {
  return jwt.sign(
    { sub: user._id.toString() },
    refreshSecret,
    refreshTokenOptions
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, jwtSecret);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret);
}