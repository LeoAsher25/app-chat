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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types';
import { UsersService } from 'src/users/users.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AddMembersDto, UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './room.schema';
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
      _id: _id,
    });
    if (!user) throw new BadRequestException('User not found');
    const rooms = await this.roomsService.findAll(
      {
        members: user._id,
      },
      // ['name', 'avatar', 'lastMessage'],
      {
        name: 1,
        _id: 1,
        lastMessage: 1,
      },
    );
    return rooms;
  }

  @Patch('/add-members')
  async addMembers(@Body() body: AddMembersDto) {
    return this.roomsService.addMembers(body.roomId, body.membersId);
  }

  @Get(':id')
  async getRoomById(@Param('id') id: string): Promise<Room> {
    return this.roomsService.getRoomDetail(id);
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
