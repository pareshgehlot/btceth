import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

// Interface DTO, thereby implementing "assetPrice (or value) field in return object" to type "String" as requested
interface IValidReturnObject {
  assetId: string;
  assetPrice: string; // specifying "string" as specified
}

@Injectable()
export class PriceService implements IValidReturnObject {
  private _assetId: string;
  private _assetPrice: string;
  constructor(private readonly http: HttpService) {
    this._assetId = '';
    this._assetPrice = '';
  }
  public get assetId() {
    // getter method implemented as class implements interface to restrict data types
    return this._assetId;
  }
  public set assetId(assetId) {
    // setter method implemented as class implements interface to restrict data types
    this._assetId = assetId;
  }
  public get assetPrice() {
    // getter method implemented as class implements interface to restrict data types
    return this._assetPrice;
  }
  public set assetPrice(assetPrice) {
    // setter method implemented as class implements interface to restrict data types
    this._assetPrice = assetPrice;
  }
  getPrice(asset: string): {} {
    return this.validateAsset(asset);
  }
  validateAsset(asset: string): {} {
    // considered as error case, so thrown error through nest framework's error handling mechanism with proper status code
    if (asset === '') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'asset should be either BTC or ETH, not empty',
        },
        400,
      );
    }
    let validAssets = ['BTC', 'ETH'];
    let isValidAsset = false;
    isValidAsset = validAssets.includes(asset);
    if (isValidAsset === true) {
      let assetsMappingArray = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
      };
      const baseApiUrl = 'https://api.coingecko.com/api/v3/coins/';
      const urlParameter = assetsMappingArray[asset];
      const finalApiUrl = baseApiUrl + urlParameter;
      return this.callThirdPartyApi(finalApiUrl, asset);
    } else {
      // considered as error case, so thrown error through nest framework's error handling mechanism with proper status code
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'asset should be either BTC or ETH, not empty',
        },
        406,
      );
    }
  }

  callThirdPartyApi(urlParameter: string, asset: string): {} {
    // added try catch block in case if anything goes wront with the request
    try {
      return this.http.get(urlParameter).pipe(
        map((apiResponse: AxiosResponse) => {
          this.assetId = asset;
          this.assetPrice = apiResponse.data.market_data.current_price.usd
            .toFixed(1)
            .toString();
          return {
            assetId: this.assetId,
            value: this.assetPrice,
          };
        }),
      );
    } catch (error) {
      // if anything goes wrong, then throw error through nest framework's error handling mechanism with proper status code
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error,
        },
        500,
      );
    }
  }
}
