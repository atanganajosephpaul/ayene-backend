import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

// Utilitaire pour générer le Token JWT
const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "defaut_secret", {
    expiresIn: "1d",
  });
};

/**
 * Enregistrement d'un nouvel utilisateur
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nom, email, motDePasse, role, statut } = req.body;

    if (!nom || !email || !motDePasse) {
      throw createHttpError(
        400,
        "Veuillez remplir tous les champs obligatoires.",
      );
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw createHttpError(
        400,
        "Cet email est déjà utilisé par un autre compte.",
      );
    }

    const newUser = new userModel({
      nom,
      email,
      motDePasse,
      role,
      statut,
    });

    await newUser.save();

    const token = generateToken(newUser._id.toString(), newUser.role);

    return res.status(201).json({
      message: "Utilisateur créé avec succès !",
      token,
      user: {
        id: newUser._id,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
        statut: newUser.statut,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      throw createHttpError(400, "L'email et le mot de passe sont requis.");
    }

    const user = await userModel.findOne({ email }).select("+motDePasse");

    if (!user || !(await user.comparerMotDePasse(motDePasse))) {
      throw createHttpError(401, "Identifiants invalides.");
    }

    if (user.statut === "suspendu") {
      throw createHttpError(
        403,
        "Compte suspendu. Veuillez contacter un administrateur.",
      );
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.status(200).json({
      message: "Connexion réussie !",
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        statut: user.statut,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
