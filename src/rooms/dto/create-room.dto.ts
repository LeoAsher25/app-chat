import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { IsObjectId } from 'src/common/decorators/validations/IsObjectId';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsObjectId()
  @IsArray()
  members: string[];

  @IsBoolean()
  isGroup: boolean;
}
