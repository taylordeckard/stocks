import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: any[], key: string, dir: 'asc' | 'desc'): any[] {
    const sorted = value?.sort((a, b) => {
      if (a[key] < b[key] || !a[key]) {
        return dir === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key] || !b[key]) {
        return dir === 'desc' ? -1 : 1;
      }
      return 0;
    });

    return sorted;
  }

}
