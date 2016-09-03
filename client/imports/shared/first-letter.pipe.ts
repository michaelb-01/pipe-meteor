import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstLetter' })
export class FirstLetterPipe implements PipeTransform {
  transform(value: any, args) {
    var matches = value.match(/\b(\w)/g); 
    return matches.join('');  
  }
}
