import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, QueryOptions } from 'mongoose';
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
          members: { $all: createRoomDto.members, $size: 2 },
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
      name: createRoomDto.name,
    });
    return newRoom.save();
  }

  findAll(
    filter: FilterQuery<Room>,
    returnedFields?: (keyof Room)[],
    options?: QueryOptions<Room>,
  ) {
    return this.roomModel.find(filter, returnedFields, options);
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
