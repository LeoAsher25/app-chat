import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { RegisterData } from './dto/register.dto';

@Injectable()
export default class AuthMiddleware {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const requestData: RegisterData = req.body;
    if (
      !requestData.username ||
      !requestData.password ||
      !requestData.firstName ||
      !requestData.lastName
    ) {
      // return res
      //   .status(HttpStatus.OK)
      //   .json(
      //     ErrorResponse(HttpStatus.BAD_REQUEST, 'Fill in requirement fields'),
      //   );
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Fill in requirement fields',
      });
    }
    const user = await this.userModel.findOne({
      username: requestData.username,
    });
    if (user) {
      // return res
      //   .status(HttpStatus.CONFLICT)
      //   .json(ErrorResponse(HttpStatus.CONFLICT, 'Username is already in use'));
      throw new ConflictException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Username is already in use',
      });
    }

    next();
  }
  async register(
    req: Request,
    res: Response,
    next: (error?: any) => void,
  ): Promise<void> {
    const requestData: RegisterData = req.body;
    if (
      !requestData.username ||
      !requestData.password ||
      !requestData.firstName ||
      !requestData.lastName
    ) {
      // return res
      //   .status(HttpStatus.OK)
      //   .json(
      //     ErrorResponse(HttpStatus.BAD_REQUEST, 'Fill in requirement fields'),
      //   );
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Fill in requirement fields',
      });
    }
    const user = await this.userModel.findOne({
      username: requestData.username,
    });
    if (user) {
      // return res
      //   .status(HttpStatus.CONFLICT)
      //   .json(ErrorResponse(HttpStatus.CONFLICT, 'Username is already in use'));
      throw new ConflictException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Username is already in use',
      });
    }

    next();
  }
}
