import {Component} from '@angular/core';

@Component({
  selector:'fabs',
  template: `
    <ul class="fabs">
      <ng-content></ng-content>

      <li>
        <div class="fab" tooltip="Actions">
          <i class="material-icons rootFab">more_vert</i>
        </div>
      </li>
    </ul>
  `
})

export class Fabs {
  constructor() {

  }
}
