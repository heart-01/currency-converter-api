import { Type } from 'class-transformer';
import { ExchangeRateDto } from 'src/services/exchange-rate/dto/exchange-rate.dto';
import { Currency } from '../entities/currency.entity';

export class CurrencyDto {
  id: number;

  name: string;

  country: string;

  @Type(() => ExchangeRateDto)
  fromExchangeRate: ExchangeRateDto[];

  @Type(() => ExchangeRateDto)
  toExchangeRate: ExchangeRateDto[];

  constructor(currency: Currency) {
    this.id = currency.id;
    this.name = currency.name;
    this.country = currency.country;
    this.fromExchangeRate = currency.fromExchangeRate;
    this.toExchangeRate = currency.toExchangeRate;
  }
}
