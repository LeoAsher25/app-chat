import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
<<<<<<< HEAD
import mongoose from 'mongoose';
=======
import { Request } from 'express';
>>>>>>> 8426d063b8750db4b30bf75b7323b0d47b42f642
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types';
import { UsersService } from 'src/users/users.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
<<<<<<< HEAD
=======

>>>>>>> 8426d063b8750db4b30bf75b7323b0d47b42f642
import { RoomsService } from './rooms.service';
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() request: RequestWithUser,
  ) {
    return this.roomsService.create({
      ...createRoomDto,
      adminId: request.user._id,
    });
  }

  @Get()
  async findAll(@Req() req: any) {
    const { _id } = req.user;
    const user = await this.userService.findOne({
      id: _id,
    });
    if (!user) throw new BadRequestException('User not found');
    return this.roomsService.findAll(
      {
        members: user._id,
      },
      ['name', 'avatar', 'lastMessage'],
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
