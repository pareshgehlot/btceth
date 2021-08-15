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
    let expectedResponse = {
      status: 406,
      error: 'asset should be either BTC or ETH, not empty',
    };
    return request(app.getHttpServer())
      .get('/price')
      .expect(406)
      .expect(expectedResponse);
  });

  it('/price (GET) with query parameter asset with value other than BTC or ETH', () => {
    let expectedResponse = {
      status: 406,
      error: 'asset should be either BTC or ETH, not empty',
    };
    return request(app.getHttpServer())
      .get('/price?asset=unknowAsset')
      .expect(406)
      .expect(expectedResponse);
  });

  it('/price (GET) with query parameter asset with empty value', () => {
    let expectedResponse = {
      status: 400,
      error: 'asset should be either BTC or ETH, not empty',
    };
    return request(app.getHttpServer())
      .get('/price?asset=')
      .expect(400)
      .expect(expectedResponse);
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
