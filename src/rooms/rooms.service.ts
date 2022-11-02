import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './rooms.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    if (createRoomDto.members.length === 2) {
      const room = await this.roomModel.findOne(
        {
          members: createRoomDto.members[1],
        },
        {
          __v: 0,
          updatedAt: 0,
          messages: {
            updatedAt: 0,
            __v: 0,
          },
        },
      );
      if (room) {
        return room;
      }
    }
    const newRoom = new this.roomModel({
      members: createRoomDto.members,
      adminId: createRoomDto.members[0],
    });
    return await newRoom.save();
  }

  findAll() {
    return this.roomModel.find();
  }

  findOne(id: string) {
    return this.roomModel.findById(id).lean();
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
