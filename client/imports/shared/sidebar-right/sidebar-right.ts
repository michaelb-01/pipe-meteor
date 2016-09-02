import { Component } from '@angular/core';
import { Jobs } from '../../../../collections/jobs.ts';

import {SharedService} from '../shared.service';
import {Subscription}   from 'rxjs/Subscription';

import { JobService } from '../../job/job.service';

import {Fabs} from '../fabs/fabs';

import { JobFormComponent } from '../../job/job-form';
import { EntityFormComponent } from '../../entity/entity-form';

@Component({
  selector: 'sidebar-right',
  templateUrl: '/client/imports/shared/sidebar-right/sidebar-right.html',
  directives: [ Fabs,
                JobFormComponent,
                EntityFormComponent ] 
})

export class SidebarRightComponent {

  public typeSubscription: Subscription;
  public selSubscription: Subscription;

  action: string = '';
  type: string = '';
  editType: string = '';

  selected: any[] = [];

  constructor(private _sharedService: SharedService) {
    this.typeSubscription = this._sharedService.type$.subscribe(type => {
                                  this.type = type;
                                  this.editType = type;
                              });

    this.selSubscription = this._sharedService.sel$.subscribe(sel => {
                              this.selected = sel;
                              console.log(sel);
                            });
  }

  showSidebarRight = false;    
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;

    console.log(this.showSidebarRight);
  }

  create(type) {
    console.log(type);
    this.toggleSidebarRight(true);
    this.action = 'create';
    this.type = type;
  }

  // form
  onSubmit(form) {
    console.log(form);
  }

  editSelected() {
    this.action = 'edit';
    this.type = this.editType;
    this.showSidebarRight = true;
  }

}