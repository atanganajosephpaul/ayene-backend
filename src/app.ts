import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Route de vérification de l'état de l'API
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API AYENE opérationnelle" });
});

export default app;
