import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ExchangeRateWithCurrenciesDto } from './dto/exchange-rate-with-currencies.dto';
import { Currency } from '../currency/entities/currency.entity';
import {
  EntityNotFoundException,
  InvalidDataError,
} from '../../errors/http-exception';
import { ExchangeRateDto } from './dto/exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,

    private readonly currencyService: CurrencyService,

    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,

    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<ExchangeRateWithCurrenciesDto[]> {
    const found = await this.exchangeRateRepository.find({
      relations: ['fromCurrency', 'toCurrency'],
    });

    return found.map((exchangeRate) => {
      return new ExchangeRateWithCurrenciesDto({
        id: exchangeRate.id,
        rate: exchangeRate.rate,
        fromCurrency: exchangeRate.fromCurrency,
        toCurrency: exchangeRate.toCurrency,
      });
    });
  }

  async findOne(id: number): Promise<ExchangeRateWithCurrenciesDto> {
    // RelationLoader
    const exchangeRateWithCurrency1 = await this.exchangeRateRepository.findOne(
      {
        where: { id },
        relations: ['fromCurrency', 'toCurrency'],
      },
    );

    // QueryBuilder
    const exchangeRateWithCurrency2 = await this.exchangeRateRepository
      .createQueryBuilder('exchangeRates')
      .leftJoinAndSelect('exchangeRates.fromCurrency', 'fromCurrency')
      .leftJoinAndSelect('exchangeRates.toCurrency', 'toCurrency')
      .andWhere('exchangeRates.id = :id', { id })
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
        exchangeRate.id = ${id}
    `;
    const exchangeRateWithCurrency3 = await this.entityManager.query(query);

    return new ExchangeRateWithCurrenciesDto({
      id: exchangeRateWithCurrency1.id,
      rate: exchangeRateWithCurrency1.rate,
      fromCurrency: exchangeRateWithCurrency1.fromCurrency,
      toCurrency: exchangeRateWithCurrency1.toCurrency,
    });
  }

  async create(
    createExchangeRateDto: CreateExchangeRateDto,
  ): Promise<ExchangeRateWithCurrenciesDto> {
    const fromCurrency = await this.currencyService.findOne(
      createExchangeRateDto.fromCurrency,
    );
    const toCurrency = await this.currencyService.findOne(
      createExchangeRateDto.toCurrency,
    );

    const newExchangeRate = new ExchangeRate();
    newExchangeRate.rate = createExchangeRateDto.rate;
    newExchangeRate.fromCurrency = fromCurrency;
    newExchangeRate.toCurrency = toCurrency;
    const newExchangeRateResult = await this.exchangeRateRepository.save(
      newExchangeRate,
    );

    return this.findOne(newExchangeRateResult.id);
  }

  async update(
    id: number,
    updateExchangeRateDto: UpdateExchangeRateDto,
  ): Promise<ExchangeRateDto> {
    const exchangeRateData = await this.exchangeRateRepository
      .createQueryBuilder('exchangeRate')
      .select([
        'exchangeRate.rate AS rate',
        'exchangeRate.from_currency_id AS fromCurrency',
        'exchangeRate.to_currency_id AS toCurrency',
      ])
      .where('exchangeRate.id = :id', { id })
      .getRawOne();

    if (isEmpty(exchangeRateData)) {
      throw new InvalidDataError(`ExchangeRate ${id} not found`);
    }

    const formattedExchangeRateData = {
      rate: exchangeRateData.rate,
      fromCurrency: exchangeRateData.fromcurrency,
      toCurrency: exchangeRateData.tocurrency,
    };

    Object.assign(formattedExchangeRateData, updateExchangeRateDto);

    try {
      await this.exchangeRateRepository.update(id, formattedExchangeRateData);
      const updatedExchangeRate = await this.exchangeRateRepository.findOne({
        where: { id },
        relations: ['fromCurrency', 'toCurrency'],
      });
      return new ExchangeRateDto(updatedExchangeRate);
    } catch (error) {
      throw new EntityNotFoundException('ExchangeRate', error);
    }
  }

  async remove(id: number): Promise<ExchangeRateWithCurrenciesDto[]> {
    await this.exchangeRateRepository.delete(id);
    return this.findAll();
  }
}
