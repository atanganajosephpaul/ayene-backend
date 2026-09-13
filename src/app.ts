import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import deviceRoutes from "./routes/device.route";
import telemetryRoutes from "./routes/telemetry.route";
import alertRoutes from "./routes/alert.route";
import adminRoutes from "./routes/admin.route";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes API V1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/devices", deviceRoutes);
app.use("/api/v1/telemetry", telemetryRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/admin", adminRoutes);

export default app;
