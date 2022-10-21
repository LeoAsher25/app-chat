import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { ErrorCodes } from 'src/types/StatusCode.enum';
import { User } from 'src/users/users.schema';
import { AppError, ErrorResponse } from 'src/utils/AppError';
import { RegisterData } from './dto/register.dto';

@Injectable()
export default class AuthMiddleware {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    console.log('this: ', this);
    const requestData: RegisterData = req.body;
    if (
      !requestData.username ||
      !requestData.password ||
      !requestData.firstName ||
      !requestData.lastName
    ) {
      return res
        .status(HttpStatus.OK)
        .json(
          ErrorResponse(ErrorCodes.BAD_REQUEST, 'Fill in requirement fields'),
        );
      // throw new AppError(
      //   HttpStatus.BAD_REQUEST,
      //   ErrorCodes.BAD_REQUEST,
      //   'Fill in requirement fields',
      // );
    }
    const user = await this.userModel.findOne({
      username: requestData.username,
    });
    if (user) {
      console.log('user: ', user);
      return res
        .status(HttpStatus.CONFLICT)
        .json(ErrorResponse(ErrorCodes.CONFLICT, 'Username is already in use'));
    }

    next();
  }
  async register(
    req: Request,
    res: Response,
    next: (error?: any) => void,
  ): Promise<Response> {
    console.log('this: ', this);
    const requestData: RegisterData = req.body;
    if (
      !requestData.username ||
      !requestData.password ||
      !requestData.firstName ||
      !requestData.lastName
    ) {
      return res
        .status(HttpStatus.OK)
        .json(
          ErrorResponse(ErrorCodes.BAD_REQUEST, 'Fill in requirement fields'),
        );
      // throw new AppError(
      //   HttpStatus.BAD_REQUEST,
      //   ErrorCodes.BAD_REQUEST,
      //   'Fill in requirement fields',
      // );
    }
    const user = await this.userModel.findOne({
      username: requestData.username,
    });
    if (user) {
      console.log('user: ', user);
      return res
        .status(HttpStatus.CONFLICT)
        .json(ErrorResponse(ErrorCodes.CONFLICT, 'Username is already in use'));
    }

    next();
  }
}
