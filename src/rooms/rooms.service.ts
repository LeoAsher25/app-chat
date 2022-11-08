import {
  BadRequestException,
  ConsoleLogger,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
    // if (createRoomDto.members.length === 1) {
    //   if (
    //     createRoomDto.members[0].toString() === createRoomDto.adminId.toString()
    //   ) {
    //     const room = await this.roomModel.findOne({
    //       members
    //     })
    //     // const room = await this.roomModel.aggregate([
    //     //   {
    //     //     $addFields: {
    //     //       memberId: { $arrayElemAt: ['$members', 1] },
    //     //     },
    //     //   },
    //     //   {
    //     //     $match: {
    //     //       memberId: new mongoose.Types.ObjectId(createRoomDto.adminId),
    //     //     },
    //     //   },
    //     //   {
    //     //     $project: {
    //     //       memberId: 0,
    //     //     },
    //     //   },
    //     // ]);
    //     // check whether personal chat box exist
    //     if (room.length > 0) {
    //       return room[0];
    //     } else {
    //       // else create new one
    //       createRoomDto.members.push(createRoomDto.adminId);
    //     }
    //   } else {
    //   }
    // }
    // check whether single box chat
    if (
      createRoomDto.members.length === 1 ||
      createRoomDto.members.length === 2
    ) {
      const room = await this.roomModel
        .findOne(
          {
            members: {
              $size: createRoomDto.members.length,
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
            lastMessage: 0,
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

  async getRoomDetail(roomId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId).populate([
      { path: 'members', select: { _id: 1, username: 1 } },
      { path: 'adminId', select: { _id: 1, username: 1 } },
    ]);
    return room;
  }

  async addMembers(roomId: string, membersId: string[]) {
    console.log('param:', roomId, membersId);
    const personalRoom = await this.roomModel.findOne({
      _id: new mongoose.Types.ObjectId(roomId),
    });
    if (!personalRoom) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Room's id not found",
      });
    }
    if (
      personalRoom.members.length === 1 ||
      personalRoom.members.length === 2
    ) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Can't add member to personal room",
      });
    }

    if (
      membersId.some((member) =>
        personalRoom.members.includes(member as string),
      )
    ) {
      throw new BadRequestException({
        statusCode: HttpStatus.CONFLICT,
        message: 'User is already be member',
      });
    }

    return await this.roomModel.findOneAndUpdate(
      {
        _id: roomId,
        members: {
          $size: {
            $gt: 2,
          },
        },
      },
      {
        $push: {
          members: membersId,
        },
      },
    );
  }
}
