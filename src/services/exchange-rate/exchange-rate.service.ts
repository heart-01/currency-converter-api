import { Injectable } from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ExchangeRateWithCurrenciesDto } from './dto/exchange-rate-with-currencies.dto';
import { Currency } from '../currency/entities/currency.entity';
import { EntityNotFoundException } from 'src/errors/http-exception';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,

    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,

    private readonly entityManager: EntityManager,
  ) {}

  async create(
    exchangeRateData: CreateExchangeRateDto,
  ): Promise<ExchangeRateWithCurrenciesDto> {
    try {
      const fromCurrency = await this.currencyRepository.findOne({
        where: { id: exchangeRateData.fromCurrency },
      });

      const toCurrency = await this.currencyRepository.findOne({
        where: { id: exchangeRateData.toCurrency },
      });

      const newExchangeRate = new ExchangeRate();
      newExchangeRate.rate = exchangeRateData.rate;
      newExchangeRate.fromCurrency = fromCurrency;
      newExchangeRate.toCurrency = toCurrency;
      const newExchangeRateResult = await this.exchangeRateRepository.save(
        newExchangeRate,
      );

      // RelationLoader
      const exchangeRateWithCurrency1 =
        await this.exchangeRateRepository.findOne({
          where: { id: newExchangeRateResult.id },
          relations: ['fromCurrency', 'toCurrency'],
        });

      // QueryBuilder
      const exchangeRateWithCurrency2 = await this.exchangeRateRepository
        .createQueryBuilder('exchangeRates')
        .leftJoinAndSelect('exchangeRates.fromCurrency', 'fromCurrency')
        .leftJoinAndSelect('exchangeRates.toCurrency', 'toCurrency')
        .andWhere('exchangeRates.id = :id', { id: newExchangeRateResult.id })
        .select([
          'exchangeRates.rate',
          'fromCurrency.name',
          'fromCurrency.country',
          'toCurrency.name',
          'toCurrency.country',
        ])
        .getOne();

      // QueryBuilder + Raw SQL
      const query = `
      SELECT
        exchangeRate.*,
        fromCurrency.id AS fromCurrencyId,
        fromCurrency.name AS fromCurrencyName,
        toCurrency.id AS toCurrencyId,
        toCurrency.name AS toCurrencyName
      FROM
        exchange_rate AS exchangeRate
      LEFT JOIN
        currency AS fromCurrency ON exchangeRate.from_currency_id = fromCurrency.id
      LEFT JOIN
        currency AS toCurrency ON exchangeRate.to_currency_id = toCurrency.id
      WHERE
        exchangeRate.id = ${newExchangeRateResult.id}
    `;
      const exchangeRateWithCurrency3 = await this.entityManager.query(query);

      return new ExchangeRateWithCurrenciesDto({
        rate: exchangeRateWithCurrency1.rate,
        fromCurrency: exchangeRateWithCurrency1.fromCurrency,
        toCurrency: exchangeRateWithCurrency1.toCurrency,
      });
    } catch (error) {
      throw new EntityNotFoundException('ExchangeRate', error);
    }
  }
}
