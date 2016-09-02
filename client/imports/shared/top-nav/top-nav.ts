import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';

@Component({
  selector: 'pipe-top-nav',
  templateUrl: '/client/imports/shared/top-nav/top-nav.html',
  directives: [ ROUTER_DIRECTIVES ]
})

export class TopNavComponent {
  constructor() {}
}