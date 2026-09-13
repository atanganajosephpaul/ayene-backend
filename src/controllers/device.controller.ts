import type { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import deviceModel from "../models/device.model";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const registerDevice = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { trackerId, nom } = req.body;

    if (!trackerId || !nom) {
      throw createHttpError(
        400,
        "Le trackerId (ex: 001) et le nom sont obligatoires.",
      );
    }

    const deviceExists = await deviceModel.findOne({ trackerId });
    if (deviceExists) {
      throw createHttpError(400, "Ce traceur est déjà enregistré.");
    }

    const device = await deviceModel.create({
      trackerId,
      nom,
      proprietaire: req.user?.id,
    });

    return res.status(201).json({
      message: "Traceur enregistré avec succès",
      device,
    });
  } catch (error) {
    next(error);
  }
};
