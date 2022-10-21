import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.schema';
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
}
