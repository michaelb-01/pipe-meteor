import { Component, EventEmitter, Output } from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import { Jobs } from '../../../collections/jobs';
import { Mongo } from 'meteor/mongo';
import { JobService } from './job.service';

import { Meteor } from 'meteor/meteor';

import {Fabs} from '../fabs/fabs';

import {SharedService} from '../../sharedService';

//const fs = require('fs');

@Component({
  selector: 'jobs',
  templateUrl: '/client/imports/job/jobs.html',
  directives: [ ROUTER_DIRECTIVES,
                Fabs ],
  providers: [ JobService ]
})

export class JobsComponent {
  jobs: Mongo.Cursor<Job>;
  subscription: any;


  constructor(private _jobService: JobService,
              public __sharedService:SharedService) {}

  ngOnInit() {
    this._jobService.getJobs();

    this.subscription = this._jobService.jobs$.subscribe(jobs => {
      if (!jobs) return;   // don't forget this, because you may subscribe the data before you got data from the server

      this.jobs = jobs;
      // do other things
    });
  }

  writeFile() {
    Meteor.call('writeFileTest',function(err, res) {
      console.log(err);
      console.log(res);
    });
  }

  @Output() myEvent = new EventEmitter();
  functionTest() {
    this.__sharedService.announce('some new value');
  }
}