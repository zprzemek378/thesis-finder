import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import studentsRouter from './routes/students';
import supervisorsRouter from './routes/supervisors';
import thesesRouter from './routes/theses';
import requestsRouter from './routes/requests';
import messagesRouter from './routes/messages';
import { verifyAccessTokenMiddleware } from './middlewares/auth';
import cors from 'cors';

const app: Express = express();
app.use(cors({
  origin: '*', // DO ZMIANY NA KONCU!!!!
}));

app.use(express.json());
app.use(cookieParser());

// Public endpoints
app.get("/", (req, res) => {
  res.send("IO Thesis Finder project - Welcome to API!");
});
app.use('/auth', authRouter);

// Middleware to protect all routes below
app.use(verifyAccessTokenMiddleware);

// Protected endpoints
app.use('/students', studentsRouter);
app.use('/supervisors', supervisorsRouter);
app.use('/theses', thesesRouter);
app.use('/requests', requestsRouter);
app.use('/messages', messagesRouter);

// Example protected route
app.get("/protected", (req: any, res: any) => {
  // @ts-ignore - verifyAccessToken attaches req.user
  res.json({ message: 'Access granted', user: req.user });
});

// Example protected data endpoint
app.post("/data", (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

export default app;
