import { Injectable } from '@angular/core';
import { Jobs } from '../../../collections/jobs';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class JobService extends MeteorComponent{
  jobs: Mongo.Cursor<Job>;
  jobs$ = new BehaviorSubject<Mongo.Cursor<Job>>(null);

  job$ = new BehaviorSubject<Job>(null);

  subscription: any;
  subscription2: any;

  constructor() {
    // run the inherited component - MeteorComponent in this case

    // MeteorComponent handles ending the subscription
    // and updating Angular's UI
    super();
  }

  getJobs() {
    this.subscription = this.subscribe('jobs', () => {
      this.jobs = Jobs.find();
      this.jobs$.next(Jobs.find());
    }, true); // set autoBind to true to auto-update Angular
  }

  getJobById(id) {
    this.subscription2 = this.subscribe('jobs', () => {
      this.job$.next(Jobs.findOne({"_id":id}));
    }, true); // set autoBind to true to auto-update Angular
  }

  create(job) {
    Jobs.insert(job);
  }
}