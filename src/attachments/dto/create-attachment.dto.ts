import { User } from 'src/users/user.schema';

export class CreateAttachmentDto {
  owner?: User;
  mimetype: string;
  filename: string;
  originalname: string;
  size: number;
  uploadedAt?: Date;
}
