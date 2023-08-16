import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from '../exchange-rate/entities/exchange-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, ExchangeRate])],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
