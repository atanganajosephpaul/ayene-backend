import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protegerRoute = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Accès non autorisé, jeton manquant" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaut_secret",
    ) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Jeton invalide ou expiré" });
  }
};
