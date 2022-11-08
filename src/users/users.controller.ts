import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll(
  //     {},
  //     {
  //       id: 1,
  //       username: 1,
  //       firstName: 1,
  //       lastName: 1,
  //     },
  //   );
  // }

  @Get()
  @UsePipes(new ValidationPipe())
  async searchUsers(@Query() query: any): Promise<User[]> {
    return this.usersService.getUserMetaData(
      {
        $expr: {
          $or: [
            {
              $regexMatch: {
                input: { $concat: ['$firstName', ' ', '$lastName'] },
                regex: query.name || '',
                options: 'i',
              },
            },
            // {
            //   $regexMatch: {
            //     input: { $concat: ['$lastName', ' ', '$firstName'] },
            //     regex: query.name,
            //     options: 'i',
            //   },
            // },
          ],
        },
      },
      ['_id', 'firstName', 'lastName', 'avatar', 'username'],
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne({
      _id: id,
    });
    if (!user) throw new BadRequestException('User not found');
    return this.usersService.findOne(
      {
        _id: id,
      },
      // ['id', 'username', 'firstName', 'lastName'],
      {
        password: 0,
      },
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
