import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  country: string;
}
