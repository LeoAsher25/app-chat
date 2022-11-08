import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Room } from 'src/rooms/room.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = new this.messageModel(createMessageDto);

    const room = await this.roomModel
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(
            (createMessageDto as CreateMessageDto).roomId,
          ),
          members: createMessageDto.senderId,
        },
        {
          lastMessage: newMessage,
          $push: {
            messages: newMessage,
          },
        },
      )
      .lean();

    newMessage.createdAt = new Date();
    return { room, newMessage };
  }

  findAll() {
    return `This action returns all messages`;
  }

  async getMessageByRoomId(roomId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ roomId: roomId })
      .populate({ path: 'sender', select: { _id: 1, username: 1 } });
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
