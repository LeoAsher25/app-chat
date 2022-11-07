import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Attachment } from 'src/attachments/attachment.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(
    filter: FilterQuery<User>,
    returnFields?: { [key: string]: 0 | 1 },
    queryOptions?: QueryOptions,
  ): Promise<User[]> {
    return this.userModel.find(filter, returnFields, queryOptions).exec();
  }
  async findOne(
    filter: FilterQuery<User>,
    returnedFields?: { [key: string]: 0 | 1 },
    options?: QueryOptions<User>,
  ) {
    return await this.userModel.findOne(filter, returnedFields, options).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async getUserMetaData(
    filter: FilterQuery<User>,
    returnFields?: (keyof User)[],
    options?: QueryOptions,
  ): Promise<User[]> {
    return this.userModel
      .find(filter, returnFields, options)
      .populate({
        path: 'avatar',
        model: Attachment.name,
        select: ['_id', 'mimetype'],
      })
      .exec();
  }
}
