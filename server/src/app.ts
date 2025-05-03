import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import { verifyAccessTokenMiddleware } from './middlewares/auth';
import mongoose from 'mongoose';

const app: Express = express();
app.use(express.json());
app.use(cookieParser());

// Public endpoints: welcome and auth routes
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("IO Thesis Finder project - Welcome to API!");
});
app.use('/auth', authRouter);

// Example protected route
app.get("/protected", verifyAccessTokenMiddleware, (req: express.Request, res: express.Response) => {
  // @ts-ignore - verifyAccessToken attaches req.user
  res.json({ message: 'Access granted', user: req.user });
});

// Example data endpoint
app.post("/data", (req: express.Request, res: express.Response) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

export default app;
