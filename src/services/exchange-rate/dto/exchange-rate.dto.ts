import { ExchangeRate } from '../entities/exchange-rate.entity';

export class ExchangeRateDto {
  id: number;
  rate: number;
  fromCurrency: number;
  toCurrency: number;

  constructor(exchangeRate: ExchangeRate) {
    this.id = exchangeRate.id;
    this.rate = exchangeRate.rate;
    this.fromCurrency = exchangeRate.fromCurrency?.id;
    this.toCurrency = exchangeRate.toCurrency?.id;
  }
}
