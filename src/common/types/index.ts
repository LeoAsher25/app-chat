import { Request } from 'express';
import { User } from 'src/users/user.schema';
export interface RequestWithUser extends Request {
  user: User; // or any other type
}
