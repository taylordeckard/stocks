import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterHighlighted'
})
export class FilterHighlightedPipe implements PipeTransform {

  transform(value: any[], filtered: boolean): any[] {
    if (filtered) {
      return value.filter(v => v.highlight);
    }

    return value;
  }

}
