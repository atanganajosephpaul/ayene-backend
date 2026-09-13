import express from "express";
import { registerDevice } from "../controllers/device.controller";
import { protegerRoute } from "../middlewares/authMiddleware";

const deviceRoutes = express.Router();
deviceRoutes.post("/", protegerRoute, registerDevice);

export default deviceRoutes;
