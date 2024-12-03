import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access Denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        (req as any).user = decoded; // Attach decoded token to request object
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};
