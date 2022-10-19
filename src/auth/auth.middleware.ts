import { Request, Response, NextFunction } from 'express';
import { RegisterData } from './dto/register.dto';

export function register(req: Request, res: Response, next: NextFunction) {
  const requestData: RegisterData = req.body;
  if (
    !requestData.username ||
    !requestData.password ||
    !requestData.firstName ||
    !requestData.lastName
  ) {
    throw new Error('Fill in required fields');
  }

  next();
}
