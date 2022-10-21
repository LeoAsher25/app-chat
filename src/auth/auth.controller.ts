import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterData } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() registerData: RegisterData) {
    return this.authService.create(registerData);
  }

  // @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    console.log('check: ', req.body, req.user);
    return req.user;
  }
}
