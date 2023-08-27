import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateWithCurrenciesDto } from './dto/exchange-rate-with-currencies.dto';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import { ExchangeRateDto } from './dto/exchange-rate.dto';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get()
  findAll(): Promise<ExchangeRateWithCurrenciesDto[]> {
    return this.exchangeRateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExchangeRateWithCurrenciesDto> {
    return this.exchangeRateService.findOne(+id);
  }

  @Post()
  create(
    @Body() createExchangeRateDto: CreateExchangeRateDto,
  ): Promise<ExchangeRateWithCurrenciesDto> {
    return this.exchangeRateService.create(createExchangeRateDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExchangeRateDto: UpdateExchangeRateDto,
  ): Promise<ExchangeRateDto> {
    return this.exchangeRateService.update(+id, updateExchangeRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ExchangeRateWithCurrenciesDto[]> {
    return this.exchangeRateService.remove(+id);
  }
}
