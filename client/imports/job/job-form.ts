import 'reflect-metadata';
import { Component, Input, NgZone } from '@angular/core';

import { MD_INPUT_DIRECTIVES } from '@angular2-material/input/input';
import { MdCheckbox} from '@angular2-material/checkbox/checkbox';

import { NgForm }    from '@angular/forms';
import { Tracker } from 'meteor/tracker';

import { JobService } from './job.service';
import { JobSharedService } from '../shared/job-shared.service';

import { SharedService } from '../shared/shared.service';

import { UserService } from '../user/user.service';

@Component({
  selector: 'job-form',
  templateUrl: '/client/imports/job/job-form.html',
  directives: [ MD_INPUT_DIRECTIVES,
                MdCheckbox ],
  providers: [ JobService, UserService ]
})
export class JobFormComponent { 
  subscription: any;
  userSubscription: any;

  job: Job = {
    _id: '',
    name: '',
    client: '',
    agency: '',
    thumbUrl: '',
    entities: [{
      type: ''
    }],
    public: true
  }

  users: User[];

  constructor(private _jobService: JobService,
              private ngZone: NgZone,
              private _userService: UserService,
              private _jobSharedService: JobSharedService) {}

  @Input() action: string;
  onSubmit(form: any) {
    //this._jobService.create(job);
    console.log(form);
  }

  test: string = 'hello';

  ngOnInit() {
    console.log(this.action + ' job form');

    if (this.action == 'edit') {
      console.log('updated with current job');
      //this._jobService.refresh();

      //this._jobService.getJobById('sPhEd3urnNLmJZ3f7');

      this.subscription = this._jobSharedService.job$.subscribe(job => {
        if (!job) return;   // don't forget this, because you may subscribe the data before you got data from the server

        this.job = job;
        // do other things
      });

      this._userService.getUsers();

      this.userSubscription = this._userService.users$.subscribe(users => {
        if (!users) {
          console.log('no users found...');
          return;
        }

        this.users = users;
        // do other things
      });
    }
  }

  slide = false;
  slideCarousel(val) {
    this.slide = val;
  }
}