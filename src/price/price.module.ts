import { HttpModule, Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  imports: [HttpModule],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
