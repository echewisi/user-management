// createUser.dto.ts
import { IsNotEmpty, IsEmail, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  phonenumber: number;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
