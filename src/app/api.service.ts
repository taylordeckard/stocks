import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

interface QuoteResponse {
  o: number;
  h: number;
  l: number;
  c: number;
  pc: number;
  t: number;
}

export interface Quote {
  open: number;
  high: number;
  low: number;
  current: number;
  previous_close: number;
  timestamp: number;
}

interface UpdateResponseData {
  data: { s: string; p: number; t: number; v: number; }[];
  type: string;
}

interface UpdateResponse {
  data: string;
}

export interface Update {
  symbol: string;
  last_price: number;
  timestamp: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {
  ws: WebSocket;
  public updates: Subject<Update> = new Subject<Update>();
  private ready = false;
  public ready$: Subject<void> = new Subject<void>();
  constructor(private http: HttpClient) {
    this.ws = new WebSocket('ws://localhost:8889');
    this.ws.addEventListener('message', (res: UpdateResponse) => {
      if (res.data === 'CONNECTED') {
        this.ready = true;
        this.ready$.next();
        return;
      }

      try {
        const data: UpdateResponseData = JSON.parse(res.data);
        data.data?.forEach(d => {
          this.updates.next({
            symbol: d.s,
            last_price: d.p,
            timestamp: d.t,
            volume: d.v,
          });
        });
      } catch (e) {
        console.error(e);
      }
    });
  }

  public getQuote(symbol: string) {
    return this.http.get<QuoteResponse>(`/ws/quote/${symbol}`)
      .pipe(map(data => ({
        open: data.o,
        high: data.h,
        low: data.l,
        current: data.c,
        previous_close: data.pc,
        timestamp: data.t,
      })));
  }

  public subscribeToStocks(symbols: string[]) {
    if (!this.ready) { return; }
    symbols.forEach(symbol => {
      this.ws.send(symbol);
    });
  }

  ngOnDestroy() {
    this.ws.close();
  }
}
