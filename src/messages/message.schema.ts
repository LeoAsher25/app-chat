import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/user.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderId: User;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: [String] })
  attachments: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
