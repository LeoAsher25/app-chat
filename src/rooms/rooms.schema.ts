import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/users.schema';

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    minlength: 2,
  })
  members: [User];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  adminId: User;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop()
  isGroup: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  // @Prop()  // listen in FE
  // hasNew: boolean;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
