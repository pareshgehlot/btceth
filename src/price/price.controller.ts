import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  @HttpCode(200)
  getPriceOfAsset(@Query() queryString): string | {} {
    return this.priceService.getPrice(queryString.asset);
  }
}
