import { ExchangeRateDto } from 'src/services/exchange-rate/dto/exchange-rate.dto';
import { Currency } from '../entities/currency.entity';
import { ExchangeRate } from 'src/services/exchange-rate/entities/exchange-rate.entity';
import { isEmpty } from 'lodash';

export class CurrencyDtoWithExchangeRateDto {
  id: number;
  name: string;
  country: string;
  fromExchangeRate: ExchangeRateDto[];
  toExchangeRate: ExchangeRateDto[];

  constructor(currency: Currency) {
    const currencyFromExchangeRate = currency.fromExchangeRate;
    const currencyToExchangeRate = currency.toExchangeRate;

    this.id = currency.id;
    this.name = currency.name;
    this.country = currency.country;

    if (!isEmpty(currencyFromExchangeRate)) {
      const fromExchangeRate = Array.isArray(currencyFromExchangeRate)
        ? currencyFromExchangeRate
        : [currencyFromExchangeRate];

      this.fromExchangeRate = fromExchangeRate.map(
        (exchangeRate: ExchangeRate) => new ExchangeRateDto(exchangeRate),
      );
    }

    if (!isEmpty(currencyToExchangeRate)) {
      const toExchangeRate = Array.isArray(currencyToExchangeRate)
        ? currencyToExchangeRate
        : [currencyToExchangeRate];

      this.toExchangeRate = toExchangeRate.map(
        (exchangeRate: ExchangeRate) => new ExchangeRateDto(exchangeRate),
      );
    }
  }
}
