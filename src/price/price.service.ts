import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PriceService {
  constructor(private readonly http: HttpService) {}
  getPrice(asset: string): string {
    return this.validateAsset(asset);
  }
  validateAsset(asset: string): string {
    if (asset === '') {
      return 'asset should be either BTC or ETH, not empty';
    }
    let validAssets = ['BTC', 'ETH'];
    let isValidAsset = false;
    isValidAsset = validAssets.includes(asset);
    if (isValidAsset === true) {
      return this.callApiToGetPrice(asset);
    } else {
      return 'This asset is not supported';
    }
  }
  callApiToGetPrice(asset: string): any {
    let assetsMappingArray = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
    };
    let urlParameter = assetsMappingArray[asset];
    const baseApiUrl = 'https://api.coingecko.com/api/v3/coins/';

    return this.http.get(baseApiUrl + urlParameter).pipe(
      map((axiosResponse: AxiosResponse) => {
        return {
          assetId: asset,
          value: axiosResponse.data.market_data.current_price.usd
            .toFixed(1)
            .toString(),
        };
      }),
    );
  }
}
