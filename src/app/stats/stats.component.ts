import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { StatsApiService } from '../stats-api.service';
import {
  faCaretDown,
  faCaretUp,
  faTrash,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { from, of, Observable, Subject } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { F } from '@angular/cdk/keycodes';

const lsStatsKey = 'stock_stats_std';
const searchRE = term => new RegExp(`.*${term}.*`, 'i');

interface Stock {
  dividendYield: number;
  forecast: string;
  highlight?: boolean;
  pivot: number;
  quote: number;
  rating: string;
  sector: string;
  symbol: string;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef<any>;
  public symbols: string[] = [];
  private refresh$ = new Subject<Stock[]>();
  public data$: Observable<Stock[]> = this.refresh$.asObservable();
  private stats: Stock[] = [];
  public sortKey = 'symbol';
  public sortDir: 'asc' | 'desc' = 'asc';
  public faTrash = faTrash;
  public faCaretUp = faCaretUp;
  public faCaretDown = faCaretDown;
  public faSync = faSync;
  public isLoading = false;
  public searchTerm = '';
  public filtered = false;

  @HostListener('document:keydown', ['$event']) onKeydown($event) {
    if ($event.metaKey && $event.keyCode === F) {
      $event.preventDefault();
      this.searchInput.nativeElement.focus();
    }
  }

  constructor(
    private api: StatsApiService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngAfterViewInit(): void {
    let stats;
    try {
      stats = JSON.parse(localStorage.getItem(lsStatsKey)) || [];
    } catch (e) { }
    if (stats) {
      this.refresh$.next(stats);
    } else {
      this.refresh$.next([]);
    }
    this.stats = stats;
    this.cdr.detectChanges();
  }

  toggleSort(sortKey: string) {
    if (this.sortKey === sortKey) {
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else {
        this.sortDir = 'asc';
      }
    } else {
      this.sortKey = sortKey;
      this.sortDir = 'asc';
    }
  }

  private async fetchData(symbols: string[]) {
    this.isLoading = true;
    this.cdr.detectChanges();
    let stats: any = await from(this.api.getStats(symbols))
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
        catchError((e) => {
          console.error(e);
          return of([])
        }),
      ).toPromise();
    this.setHighlightedRows(stats);
    this.updateLocalStocks(stats);
    localStorage.setItem(lsStatsKey, JSON.stringify(this.stats));
    this.refresh$.next(this.stats);
  }

  public onAddSymbol(symbol: string) {
    this.fetchData([symbol]);
  }

  public removeSymbol(symbol: string) {
    const symbolIdx = this.symbols.indexOf(symbol);
    this.symbols.splice(symbolIdx, 1);
    const statToRemove = this.stats.find(i => i.symbol === symbol);
    const statsIdx = this.stats.indexOf(statToRemove);
    this.stats.splice(statsIdx, 1);
    localStorage.setItem(lsStatsKey, JSON.stringify(this.stats));
    this.refresh$.next(this.stats);
  }

  public async refresh(stocks: Stock[]) {
    await this.fetchData(stocks.map(s => s.symbol));
  }

  public search() {
    if (this.searchTerm) {
      this.refresh$.next(this.stats.filter(s => searchRE(this.searchTerm).test(s.symbol)));
    } else {
      this.refresh$.next(this.stats);
    }
  }

  public toggleRowHighlight(stock: Stock) {
    stock.highlight = !stock.highlight;
    localStorage.setItem(lsStatsKey, JSON.stringify(this.stats));
  }

  private setHighlightedRows(stocks: Stock[]) {
    const highlighted = this.stats.filter(s => s.highlight);
    highlighted.forEach(h => {
      const match = stocks.find(s => s.symbol === h.symbol);
      if (match) { match.highlight = true; }
    });
  }

  private updateLocalStocks (fresh: Stock[]) {
    const newStocks = fresh.reduce((memo, f) => {
      let idx;
      const e = this.stats.find((s: Stock, i: number) => {
        idx = i;
        return s.symbol === f.symbol;
      })
      if (e) {
        this.stats.splice(idx, 1, f);
        return memo;
      }
      memo.push(f);

      return memo;
    }, []);
    this.stats.push(...newStocks);
  }
}
