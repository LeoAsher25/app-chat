import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
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

  isJsonObject(strData) {
    try {
      JSON.parse(strData);
    } catch (e) {
      return false;
    }
    return true;
  }

  async create(createMessageDto: CreateMessageDto | string) {
    createMessageDto = JSON.stringify({
      text: 'Hello world111!',
      roomId: '635a9938f509e6cec6386f28',
    });
    console.log('log: ', createMessageDto);
    if (this.isJsonObject(createMessageDto)) {
      createMessageDto = JSON.parse(createMessageDto as string);
    }

    const newMessage = new this.messageModel(createMessageDto);
    const room = await this.roomModel
      .findOneAndUpdate(
        {
          _id: (createMessageDto as CreateMessageDto).roomId,
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

  async getMessageByRoomId(roomId: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ roomId: roomId });
    return messages;
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
