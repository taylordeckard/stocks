import { Pipe, PipeTransform } from '@angular/core';

const searchRE = term => new RegExp(`.*${term}.*`, 'i');
    
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, fields: string[]): unknown {
    if (searchTerm) {
      return items?.filter(i => fields.some(f => searchRE(searchTerm).test(i[f]))) || [];
    }

    return items;
  }

}
