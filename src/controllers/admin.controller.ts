import type { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import deviceModel from "../models/device.model";
import alertModel from "../models/alert.model";

// Liste de tous les utilisateurs (Pour AdminUsers.jsx)
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userModel
      .find()
      .select("-motDePasse")
      .sort({ createdAt: -1 });
    return res.status(200).json({ count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// Liste de tout le parc de traceurs (Pour AdminParc.jsx)
export const getAllDevices = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const devices = await deviceModel
      .find()
      .populate("proprietaire", "nom email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ count: devices.length, devices });
  } catch (error) {
    next(error);
  }
};

// Statistiques d'ensemble pour le Dashboard Administrateur
export const getSystemStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalDevices = await deviceModel.countDocuments();
    const unreadAlerts = await alertModel.countDocuments({ lu: false });

    return res.status(200).json({
      stats: {
        totalUsers,
        totalDevices,
        unreadAlerts,
      },
    });
  } catch (error) {
    next(error);
  }
};
