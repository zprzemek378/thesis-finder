"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
// src/utils/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
const refreshSecret = process.env.REFRESH_SECRET || 'default_refresh_secret';
const accessTokenOptions = {
    expiresIn: process.env.JWT_EXPIRES || '15m'
};
const refreshTokenOptions = {
    expiresIn: process.env.REFRESH_EXPIRES || '7d'
};
function signAccessToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user._id.toString(), role: user.role }, jwtSecret, accessTokenOptions);
}
exports.signAccessToken = signAccessToken;
function signRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user._id.toString() }, refreshSecret, refreshTokenOptions);
}
exports.signRefreshToken = signRefreshToken;
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, jwtSecret);
}
exports.verifyAccessToken = verifyAccessToken;
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, refreshSecret);
}
exports.verifyRefreshToken = verifyRefreshToken;
