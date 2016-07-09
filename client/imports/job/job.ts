import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Jobs } from '../../../collections/jobs';
//import { Mongo } from 'meteor/mongo';
//import { Meteor } from 'meteor/meteor';
//import { JobService } from './job.service';

@Component({
  selector: 'job',
  templateUrl: '/client/imports/job/job.html',
  directives: [ ROUTER_DIRECTIVES ]
})

export class JobComponent {
  jobId: string;
  job: Job;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.jobId = params['jobId'];

      Tracker.autorun(() => {
        this.ngZone.run(() => {
          this.job = Jobs.findOne(this.jobId);
        });
      });
    });
  }
}
