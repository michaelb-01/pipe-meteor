import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Jobs } from '../../../collections/jobs';
import { EntitiesComponent } from '../entity/entities';
//import { Mongo } from 'meteor/mongo';
//import { Meteor } from 'meteor/meteor';
import { JobService } from './job.service';

import { JobSharedService } from '../shared/job-shared.service';

@Component({
  selector: 'job',
  templateUrl: '/client/imports/job/job.html',
  directives: [ ROUTER_DIRECTIVES,
                EntitiesComponent ],
  providers: [JobService]
})

export class JobComponent {
  jobId: string;
  job: Job;

  subscription: any;

  constructor(private route: ActivatedRoute, 
              private ngZone: NgZone,
              private _jobService: JobService,
              private _jobSharedService: JobSharedService ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.jobId = params['jobId'];

      this._jobSharedService.getJobById(this.jobId);

      Tracker.autorun(() => {
        this.ngZone.run(() => {

          this.subscription = this._jobSharedService.job$.subscribe(job => {
            if (!job) return;   // don't forget this, because you may subscribe the data before you got data from the server

            this.job = job;
            // do other things
          });
        });
      });
    });
  }

  test() {
    console.log(this._jobService.refresh());
  }
}
