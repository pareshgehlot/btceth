import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

describe('AppController', () => {
  let priceController: PriceController;
  let priceService: PriceService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PriceController],
      providers: [PriceService],
    }).compile();

    priceService = app.get<PriceService>(PriceService);
    priceController = app.get<PriceController>(PriceController);
  });

  describe('when asset has value other than BTC or ETH and is passed to getPriceOfAsset', () => {
    it('should return a message: This asset is not supported', async () => {
      const result = 'This asset is not supported';
      expect(await priceController.getPriceOfAsset('unknowAsset')).toBe(result);
    });
  });
});
