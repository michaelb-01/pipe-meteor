import { Component, Output, EventEmitter } from '@angular/core';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input/input';

@Component ({
  selector:'search-box',
  template:`<div class='searchBoxWrapper'>
              <md-input #input2 placeholder="Filter" 
                (input)="update.emit(input2.value)"
                autocomplete="off">
              </md-input>
            </div>`,
  directives: [
    MD_INPUT_DIRECTIVES
  ]
})

export class SearchBox {
  @Output() update = new EventEmitter();

  ngOnInit() {
    this.update.emit('');
  }
}