import express from "express";
import { getMyAlerts, markAlertAsRead } from "../controllers/alert.controller";
import { protegerRoute } from "../middlewares/authMiddleware";

const alertRoutes = express.Router();

alertRoutes.get("/", protegerRoute, getMyAlerts);
alertRoutes.patch("/:id/read", protegerRoute, markAlertAsRead);

export default alertRoutes;
