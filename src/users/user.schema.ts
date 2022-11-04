import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  avatar: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
