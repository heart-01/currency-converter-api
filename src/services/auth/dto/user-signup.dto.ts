import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(1)
  @MaxLength(70)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
