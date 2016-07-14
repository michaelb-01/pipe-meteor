import {Component} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MdCheckbox} from '@angular2-material/checkbox/checkbox';
import { NgForm }    from '@angular/forms';
import { Jobs } from '../../../collections/jobs.ts';

@Component({
  selector: 'sidebar-right',
  templateUrl: '/client/imports/sidebar-right/sidebar-right.html',
  directives: [MD_INPUT_DIRECTIVES,
               MdCheckbox]
})

export class SidebarRightComponent {
  constructor() {}

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;

    console.log(this.showSidebarRight);
  }

  addEntity(job) {
    console.log(job);
  }

  onSubmit(value: any) {
    console.log(value);

    Jobs.insert(value);
  }

}