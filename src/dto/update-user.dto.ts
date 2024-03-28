// updateUser.dto.ts
import { IsEmail, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  phonenumner: number;

  @IsOptional()
  @MinLength(6)
  password: string;
}
