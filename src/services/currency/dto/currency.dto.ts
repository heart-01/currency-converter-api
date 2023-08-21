import { Currency } from "../entities/currency.entity";

export class CurrencyDto {
  id: number;
  name: string;
  country: string;

  constructor(currency: Currency) {
    this.id = currency.id;
    this.name = currency.name;
    this.country = currency.country;
  }
}
