import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { WalletInvestorService } from './wi.service';
import { ZacksService } from './zacks.service';
import { YahooService } from './yahoo.service';

@Injectable({
  providedIn: 'root'
})
export class StatsApiService {

  constructor(
    private http: HttpClient,
	private wallet: WalletInvestorService,
	private yahoo: YahooService,
	private zacks: ZacksService,
  ) { }

  public async getStats(symbols: string[]) {
    const results = await Promise.all(symbols.map(symbol => this.wallet.getStats(symbol)));
    const reqs = [];
    const req = async (stats: any) => {
      const zacksStats = await this.zacks.getStats(stats.symbol);
	  const yahooStats = await this.yahoo.getStats(stats.symbol);
      // tslint:disable-next-line
      stats.advice = zacksStats?.[stats.symbol]?.['zacks_rank_text'] || '';
	  Object.assign(stats, yahooStats);
    };
    results.forEach(r => reqs.push(req(r)));
    await Promise.all(reqs);
	console.log(results[0]);

    return results;
  }
}
