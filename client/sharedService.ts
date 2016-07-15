import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SharedService {

  private testSource = new Subject<string>();

  testCall$ = this.testSource.asObservable();

  announce(str : string){
    console.log('save data function called ' + str);
    this.testSource.next('hello');
    //this.sharingData.name=str; 
  }
  confirm(str : string) {
    console.log('get data function called');
    //return this.sharingData.name;
  }


} 

