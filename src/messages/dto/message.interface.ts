import { User } from 'src/users/user.schema';

export interface ILastMessage {
  _id: string;
  senderId: string;
  attachments: [];
  text: string;
  createdAt: Date;
}
