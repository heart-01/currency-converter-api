import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateWithCurrenciesDto } from './dto/exchange-rate-with-currencies.dto';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';

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
}
