import { Injectable } from '@angular/core';
import { Entities } from '../../../collections/entities';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EntityService extends MeteorComponent{
  entities: Mongo.Cursor<Entity>;
  entities$ = new BehaviorSubject<Mongo.Cursor<Entity>>(null);
  subscription: any;

  constructor() {
    // run the inherited component - MeteorComponent in this case

    // MeteorComponent handles ending the subscription
    // and updating Angular's UI
    super();
  }

  getJobs() {
    this.subscription = this.subscribe('entities', () => {
      this.entities = Entities.find();
      this.entities$.next(Entities.find());
    }, true); // set autoBind to true to auto-update Angular
  }
}