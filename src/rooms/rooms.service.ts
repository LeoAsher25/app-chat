import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './rooms.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    // check whether personal chat box
    if (
      createRoomDto.members.length === 1 &&
      createRoomDto.members[0].toString() === createRoomDto.adminId.toString()
    ) {
      const room = await this.roomModel.aggregate([
        {
          $addFields: {
            testID: { $arrayElemAt: ['$members', 1] },
          },
        },
        {
          $match: {
            testID: new mongoose.Types.ObjectId(createRoomDto.adminId),
          },
        },
        {
          $project: {
            testID: 0,
          },
        },
      ]);
      // check whether personal chat box exist
      if (room.length > 0) {
        return room[0];
      } else {
        // else create new one
        createRoomDto.members.push(createRoomDto.adminId);
      }
    }
    // check whether single box chat
    else if (createRoomDto.members.length === 2) {
      const room = await this.roomModel
        .findOne(
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
        )
        .lean();
      if (room) {
        // check whether chat box exist
        return room;
      }
    }
    // else create new group chat box
    const newRoom = new this.roomModel({
      members: createRoomDto.members,
      adminId: createRoomDto.members[0],
    });
    return await newRoom.save();
  }

  findAll() {
    return `This action returns all rooms`;
  }

  async findOne(id: string) {
    return await this.roomModel.findById(id).lean();
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
