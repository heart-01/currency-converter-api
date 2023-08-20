import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExchangeRateDto {
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  fromCurrency: number;

  @IsNotEmpty()
  @IsNumber()
  toCurrency: number;
}
