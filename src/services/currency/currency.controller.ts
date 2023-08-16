import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CurrencyDto } from './dto/currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  findAll(@Query('include') includeField: string): Promise<CurrencyDto[]> {
    return this.currencyService.findAll(includeField);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include') includeField: string,
  ): Promise<CurrencyDto> {
    return this.currencyService.findOne(+id, includeField);
  }

  @Post()
  create(@Body() currencyData: CreateCurrencyDto): Promise<CurrencyDto> {
    return this.currencyService.create(currencyData);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() currencyData: UpdateCurrencyDto,
  ): Promise<CurrencyDto> {
    return this.currencyService.update(+id, currencyData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<CurrencyDto[]> {
    return this.currencyService.remove(+id);
  }
}
