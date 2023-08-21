import { CurrencyDto } from 'src/services/currency/dto/currency.dto';
import { Currency } from 'src/services/currency/entities/currency.entity';

export class ExchangeRateWithCurrenciesDto {
  rate: number;
  fromCurrency: CurrencyDto[];
  toCurrency: CurrencyDto[];

  constructor(exchangeRate: {
    rate: number;
    fromCurrency: Currency;
    toCurrency: Currency;
  }) {
    const fromCurrency = Array.isArray(exchangeRate.fromCurrency)
      ? exchangeRate.fromCurrency
      : [exchangeRate.fromCurrency];
    const toCurrency = Array.isArray(exchangeRate.toCurrency)
      ? exchangeRate.toCurrency
      : [exchangeRate.toCurrency];

    this.rate = exchangeRate.rate;
    this.fromCurrency = fromCurrency.map(
      (exchangeRate: Currency) => new CurrencyDto(exchangeRate),
    );
    this.toCurrency = toCurrency.map(
      (exchangeRate: Currency) => new CurrencyDto(exchangeRate),
    );
  }
}
