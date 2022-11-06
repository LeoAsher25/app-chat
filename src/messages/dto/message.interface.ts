import { User } from 'src/users/user.schema';

export interface ILastMessage {
  content: string;
  sender: User;
  createdAt: Date;
}
