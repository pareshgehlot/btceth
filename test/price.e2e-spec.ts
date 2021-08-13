import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PriceModule } from '../src/price/price.module';

describe('PriceController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PriceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/price (GET) without any query parameter', () => {
    return request(app.getHttpServer())
      .get('/price')
      .expect(200)
      .expect('This asset is not supported');
  });

  it('/price (GET) with query parameter asset with value other than BTC or ETH', () => {
    return request(app.getHttpServer())
      .get('/price?asset=unknowAsset')
      .expect(200)
      .expect('This asset is not supported');
  });

  it('/price (GET) with query parameter asset with empty value', () => {
    return request(app.getHttpServer())
      .get('/price?asset=')
      .expect(200)
      .expect('asset should be either BTC or ETH, not empty');
  });

  it('/price (GET) price of BTC', async () => {
    const response = await request(app.getHttpServer()).get('/price?asset=BTC');
    expect(typeof response.body).toBe('object');
    expect(response.body.hasOwnProperty('assetId')).toBe(true);
    expect(response.body).toHaveProperty('assetId', 'BTC');
    expect(response.body.hasOwnProperty('value')).toBe(true);
  });

  it('/price (GET) price of ETH', async () => {
    const response = await request(app.getHttpServer()).get('/price?asset=ETH');
    expect(typeof response.body).toBe('object');
    expect(response.body.hasOwnProperty('assetId')).toBe(true);
    expect(response.body).toHaveProperty('assetId', 'ETH');
    expect(response.body.hasOwnProperty('value')).toBe(true);
  });
});
