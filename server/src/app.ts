
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("IO Thesis Finder project - Welcome to API!");
});

app.post("/data", (req: express.Request, res: express.Response) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

export default app;