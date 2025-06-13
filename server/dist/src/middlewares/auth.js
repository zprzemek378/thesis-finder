"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessTokenMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
async function verifyAccessTokenMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        console.log("No Bearer token found");
        res.status(401).json({ message: "Brak tokena" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        // Weryfikacja tokenu i przypisanie użytkownika do req.user
        const payload = (0, jwt_1.verifyAccessToken)(token);
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
    }
    catch {
        res.status(403).json({ message: "Nieprawidłowy token" });
    }
}
exports.verifyAccessTokenMiddleware = verifyAccessTokenMiddleware;
