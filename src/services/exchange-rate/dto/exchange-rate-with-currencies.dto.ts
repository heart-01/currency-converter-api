import { CurrencyDto } from 'src/services/currency/dto/currency.dto';

export class ExchangeRateWithCurrenciesDto {
  rate: number;
  fromCurrency: CurrencyDto;
  toCurrency: CurrencyDto;

  constructor(exchangeRate: Partial<ExchangeRateWithCurrenciesDto>) {
    Object.assign(this, exchangeRate);
  }
}
