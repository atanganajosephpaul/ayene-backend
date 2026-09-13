import express from "express";
import {
  getAllUsers,
  getAllDevices,
  getSystemStats,
} from "../controllers/admin.controller";
import { protegerRoute } from "../middlewares/authMiddleware";
import { exigerAdmin } from "../middlewares/adminMiddleware";

const adminRoutes = express.Router();

// Sécurisation globale : Authentifié ET rôle ADMIN
adminRoutes.use(protegerRoute, exigerAdmin);

adminRoutes.get("/users", getAllUsers);
adminRoutes.get("/devices", getAllDevices);
adminRoutes.get("/stats", getSystemStats);

export default adminRoutes;
