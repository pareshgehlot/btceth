import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from './price.service';

describe('AppController', () => {
  let priceService: PriceService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PriceService],
    }).compile();
    priceService = app.get<PriceService>(PriceService);
  });

  describe('when asset has value other than BTC or ETH and is passed to getPriceOfAsset', () => {
    it('should return an Http Exception', () => {
      try {
        priceService.getPrice('unknowAsset');
      } catch (error) {
        expect(error.message).toBe('Http Exception');
      }
    });
  });
});
