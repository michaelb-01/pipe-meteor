import { Injectable } from '@angular/core';
import { Jobs } from '../../../collections/jobs';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class JobSharedService extends MeteorComponent{
  job$ = new BehaviorSubject<Job>(null);

  subscription: any;

  constructor() {
    // run the inherited component - MeteorComponent in this case

    // MeteorComponent handles ending the subscription
    // and updating Angular's UI
    super();
  }

  getJobById(id) {
    console.log('jobSharedService: get job with id: ' + id);

    this.subscription = this.subscribe('jobs', () => {
      var job = Jobs.findOne({"_id":id});
      this.job$.next(job);
    }, true); // set autoBind to true to auto-update Angular
  }
}