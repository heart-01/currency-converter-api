import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, } from 'class-validator';

export class UserSignInDto {
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
