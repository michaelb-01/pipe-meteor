import { Injectable } from '@angular/core';
import { Entities } from '../../../collections/entities';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EntityService extends MeteorComponent{
  entities: Mongo.Cursor<Entity>;
  entities$ = new BehaviorSubject<Mongo.Cursor<Entity>>(null);

  entity$ = new BehaviorSubject<Entity>(null);

  myTasks$ = new BehaviorSubject<Mongo.Cursor<any>>(null);

  subscription: any;

  constructor() {
    // run the inherited component - MeteorComponent in this case

    // MeteorComponent handles ending the subscription
    // and updating Angular's UI
    super();
  }

  getEntityById(id) {
    this.subscribe('entities', () => {
      this.entity$.next(Entities.findOne({"_id":id}));
    }, true); // set autoBind to true to auto-update Angular
  }

  getJobEntities(jobId) {
    this.subscribe('entities', () => {
      this.entities$.next(Entities.find({ "job.jobId":jobId }));
    }, true);
  }

  findMyTasks(user) {
    this.subscribe('entities', () => {
      this.myTasks$.next(Entities.find({ "tasks.users.name": user }));
    }, true);

    console.log('finding my tasks');
  }

  test() {
    console.log('entity service working');
  }

  assignUser(entityId, taskNum, userName) {
    // pull element (user) from array 
    var modifier = { $push: {} };
    modifier.$push['tasks.' + taskNum + '.users'] = { "name":userName };

    Entities.update( { "_id": entityId}, modifier );
  }

  unassignUser(entityId, taskNum, userName) {
    // pull element (user) from array 
    var modifier = { $pull: {} };
    modifier.$pull['tasks.' + taskNum + '.users'] = { "name":userName };

    Entities.update( { "_id": entityId}, modifier );
  }
              

}