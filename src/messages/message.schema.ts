import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Attachment } from 'src/attachments/attachment.schema';
import { IResponseAttchment } from 'src/attachments/dto/attachment.interface';
import { User } from 'src/users/user.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderId: User;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
  // roomId: Room;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop(
    raw({
      _id: String,
      filename: String,
      size: Number,
    }),
  )
  attachments: IResponseAttchment;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
