import { Component } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Users } from '../../../collections/users';
import { Mongo } from 'meteor/mongo';

import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';

@Component({
  selector: 'users',
  templateUrl: '/client/imports/user/users.html',
  directives: [ ROUTER_DIRECTIVES ]
})

export class UsersComponent extends MeteorComponent {
  users: Mongo.Cursor<User>;
  subscription: any;
  userId: string;

  constructor(private route: ActivatedRoute) { 
    super();

    this.route.params.subscribe((params) => {
      
      this.subscribe('users', () => {
        this.userId = params['userId'];

          this.autorun(() => {
            this.users = Users.find();
          });

      }, true);

    });
  }
}