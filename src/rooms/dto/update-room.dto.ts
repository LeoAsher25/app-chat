import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

export interface AddMembersDto {
  roomId: string;
  membersId: string[];
}
