import { Injectable } from '@angular/core';
import * as jquery from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class WalletInvestorService {
  public async getStats(symbol: string) {
    let result;
    try {
      result = await fetch(
        `https://walletinvestor.com/stock-forecast/${symbol}-stock-prediction`,
      );
    } catch (e) {
      throw e;
      return { symbol };
    }

    const htmlText = await result.text();
    const $ = jquery(htmlText.replace(/src=".*?"/g, ''));

    return {
      symbol,
      cap: this._getMarketCap($),
      forecast: this._getForecast($),
      pivot: this._getPivot($),
      rating: this._getRating($),
      sector: this._getSector($),
    };
  }

  private _getQuote($: any) {
    const getNumRegex = /.*?([0-9.]+)/;
    const quoteText = $.find('.header:contains("Current Price")').next().text();
    return Number(quoteText.match(getNumRegex)?.[1]);
  }

  private _getRating($: any) {
    return $.find('.currency-forecast-rating').text();
  }

  private _getForecast($: any) {
    return $.find('[itemprop="acceptedAnswer"] [itemProp="text"] span').text();
  }

  private _getSector($: any) {
    const sectorRE = /Sector.*?:.*?\s\s([A-Za-z\s]+?)\s\s/;
    const text = $.find('.panel-body:contains("Sector")').text();
    return text.match(sectorRE)?.[1];
  }

  private _getPivot($: any) {
    const pivotRE = /Pivot Point: .*?([0-9.]+)/;
    const text = $.find('.panel-body:contains("Pivot Point:")').text();
    return Number(text.match(pivotRE)?.[1]);
  }

  private _getDividendYield($: any) {
    const dyRE = /Forward Annual Dividend Yield: .*?([0-9.]+)/;
    const text = $.find('.panel-body:contains("Forward Annual Dividend Yield:")').text();
    return Number(text.match(dyRE)?.[1]);
  }

  private _getMarketCap($: any) {
    const capRE = /Market Cap.*?(([0-9.]+) .)/;
    const text = $.find('.panel-body:contains("Market Cap")').text();
    const cap = text.match(capRE)?.[1] || '?';
    let num;
    switch (cap.substr(-1)) {
      case 'T':
        num = Number(cap.substring(0, cap.length - 1)) * 1000000000000;
      break;
      case 'B':
        num = Number(cap.substring(0, cap.length - 1)) * 1000000000;
      break;
      case 'M':
        num = Number(cap.substring(0, cap.length - 1)) * 1000000;
      break;
      default:
        num = Number(cap.substring(0, cap.length - 1));
    }

    return num;
  }
}
