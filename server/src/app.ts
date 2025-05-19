import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import studentsRouter from './routes/students';
import supervisorsRouter from './routes/supervisors';
import thesesRouter from './routes/theses';
import requestsRouter from './routes/requests';
import messagesRouter from './routes/messages';
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
app.use('/students', studentsRouter);
app.use('/supervisors', supervisorsRouter);
app.use('/theses', thesesRouter);
app.use('/requests', requestsRouter);
app.use('/messages', messagesRouter);

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
