import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/user.schema';

@Schema({
  versionKey: false,
})
export class Attachment extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
  owner: User;

  @Prop()
  mimetype: string;

  @Prop()
  filename: string;

  @Prop()
  originalname: string;

  @Prop()
  size: number;

  @Prop({ default: new Date() })
  uploadedAt: Date;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
