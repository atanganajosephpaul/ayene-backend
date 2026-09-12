import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API AYENE opérationnelle" });
});

export default app;
