import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const exigerAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // req.user est injecté par le middleware protegerRoute (JWT)
  const user = (req as any).user;

  if (!user) {
    return next(createHttpError(401, "Authentification requise."));
  }

  if (user.role !== "ADMIN") {
    return next(
      createHttpError(403, "Accès refusé. Droits d'administrateur requis."),
    );
  }

  next();
};
