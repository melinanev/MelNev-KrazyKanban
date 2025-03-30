import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const secret = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Add user data to the request object
    req.user = decoded;
    
    // Continue to the next middleware
    return next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};
