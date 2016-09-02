import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any, args) {
    if (!args) {
      return value;
    } else if (value) {
      return value.filter(item => {
        for (let key in item) {
          if (item[key].toString().toLowerCase().indexOf(args.toString().toLowerCase()) !== -1) {
            return true;
          }
        }
      });
    }
  }
}