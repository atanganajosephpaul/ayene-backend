import express from "express";
import {
  getLatestTelemetry,
  getTelemetryHistory,
} from "../controllers/telemetry.controller";
import { protegerRoute } from "../middlewares/authMiddleware";

const telemetryRoutes = express.Router();

// Récupère la toute dernière position
telemetryRoutes.get("/latest/:trackerId", protegerRoute, getLatestTelemetry);

// Récupère l'historique récent des points de géolocalisation
telemetryRoutes.get("/history/:trackerId", protegerRoute, getTelemetryHistory);

export default telemetryRoutes;
