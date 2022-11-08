import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { authConstants } from './constants';
import { JwtPayload } from './dto/auth.interface';
import { RegisterData } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>, // private usersService: UsersService
    private jwtService: JwtService,
  ) {}
  create(registerData: RegisterData) {
    const newUser = new this.userModel(registerData);
    return newUser.save();
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).lean();
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string): Promise<User> {
    if (!token) return null;
    try {
      const payload: JwtPayload = await this.jwtService.verify(token, {
        secret: authConstants.secret,
      });
      const user: User = await this.userModel
        .findOne(
          { _id: payload.sub },
          {
            _id: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
          },
        )
        .lean();
      if (!user)
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        });
      return user;
    } catch (err) {
      // throw new Error({ message: err.message });
      return null;
    }
  }
}
