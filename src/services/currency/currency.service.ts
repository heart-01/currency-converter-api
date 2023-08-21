import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CurrencyDtoWithExchangeRateDto } from './dto/currency-with-exchange-rate.dto';
import { CurrencyDto } from './dto/currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async findAll(includeField?: string): Promise<CurrencyDtoWithExchangeRateDto[]> {
    let relations = [];
    if (includeField === 'exchange-rate') {
      relations = ['fromExchangeRate', 'toExchangeRate'];
    }

    const found = await this.currencyRepository.find({
      relations,
    });
    return found.map((currency) => new CurrencyDtoWithExchangeRateDto(currency));
  }

  async findOne(id: number, includeField?: string): Promise<CurrencyDtoWithExchangeRateDto> {
    let relations = [];
    if (includeField === 'exchange-rate') {
      relations = ['fromExchangeRate', 'toExchangeRate'];
    }

    const found = await this.currencyRepository.findOne({
      where: { id },
      relations,
    });
    if (!found) throw new NotFoundException(`Currency ${id} not found`);
    return new CurrencyDtoWithExchangeRateDto(found);
  }

  async create(currencyData: CreateCurrencyDto): Promise<CurrencyDto> {
    const currency = this.currencyRepository.create(currencyData);
    const newCurrency = await this.currencyRepository.save(currency);
    return new CurrencyDto(newCurrency);
  }

  async update(
    id: number,
    currencyData: UpdateCurrencyDto,
  ): Promise<CurrencyDtoWithExchangeRateDto> {
    await this.currencyRepository.update(id, currencyData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<CurrencyDtoWithExchangeRateDto[]> {
    await this.currencyRepository.delete(id);
    return this.findAll();
  }
}
