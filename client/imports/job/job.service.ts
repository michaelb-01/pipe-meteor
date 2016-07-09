import { Injectable } from '@angular/core';
import { Jobs } from '../../../collections/jobs';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class JobService extends MeteorComponent{
  jobs: Mongo.Cursor<Object>;
  jobs$ = new BehaviorSubject<Mongo.Cursor<Object>>(null);
  subscription: any;

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
}