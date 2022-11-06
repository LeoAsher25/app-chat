import {
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
import { SearchUserDto } from './dto/search-user.dto';
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
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne({
  //     id,
  //   });
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('/search')
  @UsePipes(new ValidationPipe())
  async searchUsers(@Query() query: SearchUserDto): Promise<User[]> {
    return this.usersService.getUserMetaData(
      {
        $expr: {
          $or: [
            {
              $regexMatch: {
                input: { $concat: ['$firstName', ' ', '$lastName'] },
                regex: query.name,
                options: 'i',
              },
            },
            {
              $regexMatch: {
                input: { $concat: ['$lastName', ' ', '$firstName'] },
                regex: query.name,
                options: 'i',
              },
            },
          ],
        },
      },
      ['_id', 'firstName', 'lastName', 'avatar', 'username'],
      {
        limit: query.limit || 10,
        skip: (query.limit || 10) * (query.page || 0),
      },
    );
  }
}
