import {Component} from '@angular/core';

@Component({
  selector: 'sidebar-left',
  templateUrl: '/client/imports/shared/sidebar-left/sidebar-left.html'
})

export class SidebarLeftComponent {
  constructor() {}

  showSidebarLeft = false;
  toggleSidebarLeft(newState) {
    this.showSidebarLeft = newState;
  }

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;
  }

}