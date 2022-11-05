import { IsArray, IsNotEmpty, IsString } from 'class-validator';
// import { IsObjectId } from 'src/common/decorators/validations/IsObjectId';
import { IsObjectId } from '../../common/decorators/validations/IsObjectId';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  // @IsNotEmpty()
  @IsObjectId()
  senderId: string;

  @IsNotEmpty()
  @IsObjectId()
  roomId: string;

  @IsArray()
  @IsObjectId()
  attachments: string[];
}
