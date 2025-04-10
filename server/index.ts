import express from "express";

const PORT = 3000;

const app = express();
// Middleware do parsowania JSON
app.use(express.json());

// Prosty endpoint GET
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, TypeScript with Express!");
});

// Endpoint POST
app.post("/data", (req: express.Request, res: express.Response) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

// Startowanie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
