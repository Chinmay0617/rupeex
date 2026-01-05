
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken {
    user: {
        id: string;
    };
}

// Extend the Express Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export default function(req: Request, res: Response, next: NextFunction) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
