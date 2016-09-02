import { Injectable } from '@angular/core';
import { Users } from '../../../collections/users';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService extends MeteorComponent{
  users$ = new BehaviorSubject<Mongo.Cursor<User>>(null);
  subscription: any;

  constructor() {
    // run the inherited component - MeteorComponent in this case

    // MeteorComponent handles ending the subscription
    // and updating Angular's UI
    super();
  }

  getUsers() {
    this.subscription = this.subscribe('users', () => {
      this.users$.next(Users.find());
    }, true); // set autoBind to true to auto-update Angular
  }
}