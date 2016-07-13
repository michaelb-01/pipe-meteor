import {Component} from '@angular/core';

@Component({
  selector: 'sidebar-right',
  templateUrl: '/client/imports/sidebar-right/sidebar-right.html'
})

export class SidebarRightComponent {
  constructor() {}

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;

    console.log(this.showSidebarRight);
  }

}