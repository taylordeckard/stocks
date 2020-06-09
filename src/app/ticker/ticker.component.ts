import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ApiService, Quote, Update } from '../api.service';
import { interval, Observable, Subject } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss']
})
export class TickerComponent implements OnDestroy, OnInit {

  @Input() symbol: string;
  public changePercent: number;
  public price: number;
  public data: Partial<Quote & Update> = {};
  public data$: Observable<Quote & Update>;
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(private api: ApiService) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.symbol = this.symbol.toUpperCase();
    this.data$ = this.api.getQuote(this.symbol)
      .pipe(
        map(quote => {
          return {
            ...quote,
            last_price: quote.current,
            symbol: this.symbol,
          };
        }),
        tap((quote: Quote) => this.data = Object.assign({}, quote)),
        mergeMap(() => this.api.updates
          .pipe(startWith(this.data))),
        filter(update => update.symbol === this.symbol),
        map(update => {
          return Object.assign({}, this.data, update);
        }),
        tap((update: Quote & Update) => this.data = update),
        takeUntil(this.destroyed$),
      );
  }
}
