import type { Response, NextFunction } from "express";
import createHttpError from "http-errors";
import alertModel from "../models/alert.model";
import deviceModel from "../models/device.model";
import type { AuthRequest } from "../middlewares/authMiddleware";

// Récupère les alertes associées aux traceurs du propriétaire connecté
export const getMyAlerts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const myDevices = await deviceModel.find({ proprietaire: req.user?.id });
    const deviceIds = myDevices.map((d) => d._id);

    const alerts = await alertModel
      .find({ device: { $in: deviceIds } })
      .populate("device", "trackerId nom")
      .sort({ createdAt: -1 });

    return res.status(200).json({ count: alerts.length, alerts });
  } catch (error) {
    next(error);
  }
};

// Marque une alerte comme lue
export const markAlertAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const alert = await alertModel.findByIdAndUpdate(
      id,
      { lu: true },
      { new: true },
    );

    if (!alert) {
      throw createHttpError(404, "Alerte introuvable.");
    }

    return res
      .status(200)
      .json({ message: "Alerte marquée comme lue.", alert });
  } catch (error) {
    next(error);
  }
};
