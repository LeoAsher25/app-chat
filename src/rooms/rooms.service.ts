import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, QueryOptions } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './room.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    // @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userService: UsersService,
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
            memberId: { $arrayElemAt: ['$members', 1] },
          },
        },
        {
          $match: {
            memberId: new mongoose.Types.ObjectId(createRoomDto.adminId),
          },
        },
        {
          $project: {
            memberId: 0,
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
            members: {
              $size: 2,
              $all: createRoomDto.members,
            },
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
    if (!createRoomDto.name) {
      const members = await this.userService.findAll(
        {
          _id: {
            $in: createRoomDto.members,
          },
        },
        // ['_id', 'username'],
        {
          _id: 1,
          username: 1,
        },
      );
      createRoomDto.name = members.map((mem) => mem.username).join(', ');
      // createRoomDto.name = members;
    }
    const newRoom = new this.roomModel({
      members: createRoomDto.members,
      adminId: createRoomDto.members[0],
      name: createRoomDto.name,
    });

    return newRoom.save();
  }

  async findAll(
    filter: FilterQuery<Room>,
    returnedFields?: { [key: string]: number },
    options?: QueryOptions<Room>,
  ) {
    return await this.roomModel.find(filter, returnedFields, options);
  }

  findOne(
    filter: FilterQuery<Room>,
    returnedFields?: { [key: string]: number },
    options?: QueryOptions<Room>,
  ) {
    return this.roomModel.findById(filter, returnedFields, options).lean();
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
