import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockPercent'
})
export class StockPercentPipe implements PipeTransform {

  transform(open: number, current: number): number {
    return ((current / open) * 100) - 100;
  }

}
