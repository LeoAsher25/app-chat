import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  //   @Type(() => Number)
  //   @IsNumber()
  //   @Min(1)
  //   limit: number;

  //   @Type(() => Number)
  //   @IsNumber()
  //   @Min(0)
  //   page: number;
}
