import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import mongoose, { Model } from 'mongoose';
import { Room } from 'src/rooms/rooms.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './messages.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = new this.messageModel(createMessageDto);
    console.log('createMessageDto: ', createMessageDto);
    const room = await this.roomModel
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(
            (createMessageDto as CreateMessageDto).roomId,
          ),
        },
        {
          $push: {
            messages: newMessage,
          },
        },
      )
      .lean();
    return { room, newMessage };
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
