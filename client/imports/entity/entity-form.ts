import 'reflect-metadata';
import { Component, Input, NgZone } from '@angular/core';

import { MD_INPUT_DIRECTIVES } from '@angular2-material/input/input';
import { MdCheckbox} from '@angular2-material/checkbox/checkbox';

import { NgForm }    from '@angular/forms';
import { Tracker } from 'meteor/tracker';

import { UserService } from '../user/user.service';

import { MeteorComponent } from 'angular2-meteor';

@Component({
  selector: 'entity-form',
  templateUrl: '/client/imports/entity/entity-form.html',
  directives: [ MD_INPUT_DIRECTIVES,
                MdCheckbox ],
  providers: [ UserService ]
})
export class EntityFormComponent extends MeteorComponent { 
  subscription: any;

  users: User[];
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  public query = '';

  constructor(private ngZone: NgZone,
              private _userService: UserService) {

    super();
  }

  @Input() action: string;
  @Input() sel;

  ngOnInit() {
    this._userService.getUsers();

    this.subscription = this._userService.users$.subscribe(users => {
      if (!users) return;  

      this.users = users;
    });
  }

  filterUsers() {
    this.filteredUsers = [];

    console.log('query: ' + this.query);

    if (this.query !== '') {
      this.users.forEach((user) => {
        console.log('check: ' + user.name);
        console.log(user.name.toLowerCase().indexOf(this.query.toLowerCase()));

        // begins with
         if (user.name.toLowerCase().substring(0, this.query.length) == this.query.toLowerCase()) {
          this.filteredUsers.push(user);
        }

        // string contains
        /*
        if (user.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
          console.log('found!');
          this.filteredUsers.push(user);
        }
        */
      });
    }
  }

  addUser(user) {
    var allowed = 1;

    this.selectedUsers.forEach((userCheck) => {
      if (user._id == userCheck._id) {
        allowed = 0;
      }
    });

    if (allowed) {
      this.selectedUsers.push(user);
    }
  }

  handleTab(event) {
    event.preventDefault();

    if (this.filteredUsers.length > 0) {
      this.addUser(this.filteredUsers[0]);
    }

    this.query = '';
    this.filteredUsers = [];
  }

  removeUser(index) {
    this.selectedUsers.splice(index,1);
  }

  slide = false;
  slideCarousel(val) {
    this.slide = val;
  }
}