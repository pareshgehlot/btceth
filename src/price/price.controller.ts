import { Controller, Get, Query } from '@nestjs/common';
import { PriceService } from './price.service';

// route to receive price should be /price and get request should be used
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}
  // get request used
  @Get()
  getPriceOfAsset(@Query() queryString): {} {
    return this.priceService.getPrice(queryString.asset);
  }
}
