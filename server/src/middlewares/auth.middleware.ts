import { Request, Response, NextFunction } from 'express';

// Mock authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      code: 401, 
      message: 'Unauthorized - No token provided' 
    });
  }

  const token = authHeader.split(' ')[1];

  // Mock token validation - in production, verify JWT
  if (token) {
    // Simulate userId extraction
    (req as any).userId = 'mock-user-id';
    next();
  } else {
    return res.status(401).json({ 
      code: 401, 
      message: 'Unauthorized - Invalid token' 
    });
  }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      (req as any).userId = 'mock-user-id';
    }
  }

  next();
};
