import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SharedService {

  private formSource = new Subject<string>();

  form$ = this.formSource.asObservable();

  edit(type) {
    console.log('create ' + type);
    this.formSource.next('edit');
  }

  create(type) {
    console.log('create ' + type);
    this.formSource.next('create');
  }

  announce(str : string){
    console.log('save data function called ' + str);
    this.formSource.next('hello');
    //this.sharingData.name=str; 
  }
  confirm(str : string) {
    console.log('get data function called');
    //return this.sharingData.name;
  }


} 

