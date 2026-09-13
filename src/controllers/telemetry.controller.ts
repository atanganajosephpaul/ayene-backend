import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import deviceModel from "../models/device.model";
import telemetryModel from "../models/telemetry.model";

// Récupérer la dernière position
export const getLatestTelemetry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { trackerId } = req.params;

    const device = await deviceModel.findOne({ trackerId });
    if (!device) {
      throw createHttpError(404, "Traceur non trouvé.");
    }

    const telemetry = await telemetryModel
      .findOne({ device: device._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ telemetry });
  } catch (error) {
    next(error);
  }
};

// Récupérer l'historique des positions pour le tracé de la carte
export const getTelemetryHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { trackerId } = req.params;
    const limit = Number(req.query.limit) || 100; // Par défaut les 100 derniers relevés

    const device = await deviceModel.findOne({ trackerId });
    if (!device) {
      throw createHttpError(404, "Traceur non trouvé.");
    }

    const history = await telemetryModel
      .find({ device: device._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};
