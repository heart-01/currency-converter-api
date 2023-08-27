import { ExchangeRate } from '../entities/exchange-rate.entity';
import { get } from 'lodash';

export class ExchangeRateDto {
  id: number;
  rate: number;
  fromCurrency: number;
  toCurrency: number;

  constructor(exchangeRate: ExchangeRate) {
    this.id = exchangeRate.id;
    this.rate = exchangeRate.rate;
    this.fromCurrency = get(
      exchangeRate,
      'fromCurrency.id',
      get(exchangeRate, 'fromCurrency', undefined),
    );
    this.toCurrency = get(
      exchangeRate,
      'toCurrency.id',
      get(exchangeRate, 'toCurrency', undefined),
    );
  }
}
