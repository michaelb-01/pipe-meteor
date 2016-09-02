import { Component } from '@angular/core';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input/input';

@Component({
  selector: 'sidebar-right',
  templateUrl: '/client/imports/sidebar-right/sidebar-right.html',
  directives: [MD_INPUT_DIRECTIVES,
               MdCheckbox,
               Fabs ]  // include jobs component to listen for event emitter
})

export class SidebarRightComponent {

}