import { Pipe, PipeTransform } from '@angular/core';

interface ColorizeClassDef {
  good?: boolean;
  bad?: boolean;
  neutral?: boolean;
}

@Pipe({
  name: 'colorize'
})
export class ColorizePipe implements PipeTransform {

  transform(forecast: string | number): ColorizeClassDef {
    if (typeof forecast === 'string')  {
      switch (forecast?.toLowerCase()) {
        case 'acceptable':
        case 'hold':
          return { neutral: true };
        case 'bad':
        case 'not so good':
        case 'sell':
        case 'strong sell':
          return { bad: true };
        case 'awesome':
        case 'good':
        case 'very good':
        case 'outstanding':
        case 'buy':
        case 'strong buy':
          return { good: true };
      }
    } else {
      if (forecast < 2.25) {
        return { good: true };
      } else if (forecast < 3.75) {
        return { neutral: true };
      } else {
        return { bad: true };
      }
    }
  }
}
