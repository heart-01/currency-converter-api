import { Body, Controller, Post } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateWithCurrenciesDto } from './dto/exchange-rate-with-currencies.dto';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Post()
  async create(
    @Body() exchangeRateData: CreateExchangeRateDto,
  ): Promise<ExchangeRateWithCurrenciesDto> {
    return await this.exchangeRateService.create(exchangeRateData);
  }
}
