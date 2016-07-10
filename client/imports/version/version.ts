import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Jobs } from '../../../collections/jobs';
//import { Mongo } from 'meteor/mongo';
//import { Meteor } from 'meteor/meteor';
//import { JobService } from './job.service';

@Component({
  selector: 'entity',
  templateUrl: '/client/imports/entity/entity.html',
  directives: [ ROUTER_DIRECTIVES ]
})

export class EntityComponent {
  entityName: string;
  job: Job;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.entityName = params['entityName'];

      Tracker.autorun(() => {
        this.ngZone.run(() => {
          //this.job = Jobs.findOne(this.jobId);
          console.log(this.entityName);
        });
      });
    });
  }
}
