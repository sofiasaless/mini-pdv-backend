import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

export function authMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getTokenFromHeaders(req);

      const decoded = await getAuth().verifyIdToken(token);

      req.user = {
        id: decoded.uid,
      };

      return next();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unauthorized';
      return res.status(401).json({ message });
    }
  };
}

function getTokenFromHeaders(req: Request) {
  const header = req.headers.authorization;

  if (!header) throw new Error("Token não identificado");

  const [, token] = header.split(" ");
  return token;
}
