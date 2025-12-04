// src/shared/auth.middleware.ts
import { NextFunction, Response, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

// نضمن أنه string فقط (لا يوجد undefined)
const JWT_SECRET: string = process.env.JWT_SECRET ?? 'default_secret';

export interface AuthPayload {
  userId: number;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;

    if (typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const { userId, role } = decoded as JwtPayload & {
      userId?: number;
      role?: UserRole;
    };

    if (userId === undefined || role === undefined) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = { userId, role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
