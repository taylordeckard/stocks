import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ZacksService {
  public async getStats(symbol: string) {
    const result = await fetch(
      `https://quote-feed.zacks.com/index.php?t=${symbol}`,
    );

    return await result.json();
  }
}
