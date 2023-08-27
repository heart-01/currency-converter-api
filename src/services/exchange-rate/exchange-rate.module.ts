import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateController } from './exchange-rate.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../currency/entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { CurrencyService } from '../currency/currency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, ExchangeRate])],
  controllers: [ExchangeRateController],
  providers: [CurrencyService, ExchangeRateService],
})
export class ExchangeRateModule {}
