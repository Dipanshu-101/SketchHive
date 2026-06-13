import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';


export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?? "";
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if(decoded) {
        (req as any).userId = (decoded as any).userId;
        next();
    }else {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    
}

// JWT Token
//     ↓
// Middleware verifies token
//     ↓
// Extract userId
//     ↓
// Attach userId to req
//     ↓
// All future routes know who the user is