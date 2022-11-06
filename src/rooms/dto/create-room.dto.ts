import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
// import { IsObjectId } from 'src/common/decorators/validations/IsObjectId';
import { IsObjectId } from '../../common/decorators/validations/IsObjectId';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsObjectId()
  @IsArray()
  members: string[];

  @IsNotEmpty()
  @IsObjectId()
  adminId: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
