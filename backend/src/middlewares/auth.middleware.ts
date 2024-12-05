import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET;
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}
/**
 * Verify JWT Token Middleware
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Retrieve token from authorization header
  const token = req.headers["authorization"]?.split(" ")[1]!;

  if (!token) {
    res.status(401).json({ error: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY!) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err: any) {
    const errorMessage =
      err.name === "TokenExpiredError" ? "Token Expired" : "Invalid Token";
    res.status(401).json({ error: errorMessage });
  }
};
