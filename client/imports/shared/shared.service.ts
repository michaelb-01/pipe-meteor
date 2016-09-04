import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SharedService {

  private typeSource = new Subject<string>();
  type$ = this.typeSource.asObservable();

  private selSource = new Subject<string[]>();
  sel$ = this.selSource.asObservable();

  // empty array to hold ids of selected objects (of any kind)
  selected:string[] = [];

  updateSel(obj, type) {
    // iterate over selected items and check if the given item is in the array
    var found = false;
    var i;
    for(i = 0; i < this.selected.length; i++) {
        if (this.selected[i].id + this.selected[i].type == obj.id + obj.type) {
            found = true;
            break;
        }
    }

    if (found) {
      this.selected.splice(i, 1);
    }
    else {
      this.selected.push(obj);
    }

    this.selSource.next(this.selected);
    this.typeSource.next(type);
  }
} 

