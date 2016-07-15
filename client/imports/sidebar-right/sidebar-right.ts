import {Component} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MdCheckbox} from '@angular2-material/checkbox/checkbox';
import { NgForm }    from '@angular/forms';
import { Jobs } from '../../../collections/jobs.ts';

import {SharedService} from '../../sharedService';
import {Subscription}   from 'rxjs/Subscription';

import { JobsComponent } from '../job/jobs'; 

@Component({
  selector: 'sidebar-right',
  templateUrl: '/client/imports/sidebar-right/sidebar-right.html',
  directives: [MD_INPUT_DIRECTIVES,
               MdCheckbox,
               JobsComponent ]  // include jobs component to listen for event emitter
})

export class SidebarRightComponent {

 public subscription: Subscription;

  constructor(private __sharedService: SharedService) {
            this.subscription = this.__sharedService.
                                      testCall$.subscribe(m => {
                                          this.showSidebarRight = true;
                                          console.log('received call');
                                      });
  }

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

  myEvent($event) {  
    console.log('function test success');
  }

}