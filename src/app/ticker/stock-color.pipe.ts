import { Pipe, PipeTransform } from '@angular/core';
import { Quote, Update } from '../api.service';
import { StockPercentPipe } from './stock-percent.pipe';

@Pipe({
  name: 'stockColor'
})
export class StockColorPipe implements PipeTransform {
  stockPercent: StockPercentPipe = new StockPercentPipe();

  transform(quote: Quote & Update): 'green' | 'red' {
    const percent = this.stockPercent.transform(quote.open, quote.last_price);

    if (percent >= 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

}
