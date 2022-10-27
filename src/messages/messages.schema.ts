import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Room } from 'src/rooms/rooms.schema';
import { User } from 'src/users/users.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
  roomId: Room;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
