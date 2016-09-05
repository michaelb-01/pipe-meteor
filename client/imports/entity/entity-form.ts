import 'reflect-metadata';
import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';

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
  selectedUsersID: string;

  public query = '';

  constructor(private ngZone: NgZone,
              private _userService: UserService) {

    super();
  }

  @Input() action: string;
  @Input() sel;

  @Output() onAssign = new EventEmitter();

  ngOnInit() {
    this._userService.getUsers();

    this.subscription = this._userService.users$.subscribe(users => {
      if (!users) return;  

      this.users = users;
    });
  }

  filterUsers() {
    this.filteredUsers = [];

    if (this.query !== '') {
      this.users.forEach((user) => {
        if (user.name.toString().toLowerCase().indexOf(this.query.toString().toLowerCase()) !== -1) {
        // begins with
        //if (user.name.toLowerCase().substring(0, this.query.length) == this.query.toLowerCase()) {
          let allowed = 1;

          this.selectedUsers.forEach((selectedUser) => {
            if (user._id == selectedUser._id) {
              allowed = 0;
            }
          });

          if (allowed == 1) {
            this.filteredUsers.push(user);
          }
        }
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
      this.addUser(this.filteredUsers[this.selectedItem]);
      this.selectedItem = 0;
    }

    this.query = '';
    this.filteredUsers = [];
  }

  removeUser(index) {
    this.selectedUsers.splice(index,1);
    this.filterUsers();  // update filtered users
    document.getElementById("search-box-input").focus();  // set focus back to input
  }

  slide = false;
  slideCarousel(val) {
    this.slide = val;
  }

  selectedItem = 0;
  handleArrow(key) {
    //event.preventDefault();

    if (key == 40) {
      this.selectedItem = Math.min(this.selectedItem  + 1, this.filteredUsers.length);
    }
    else if (key == 38) {
      this.selectedItem = Math.max(this.selectedItem -1, 0);
    }
  }

  assign() {
    console.log('assign');
    this.onAssign.emit({mode:true, users:this.selectedUsers});
  }

  unassign() {
    console.log('unassign');
    this.onAssign.emit({mode:false, users:this.selectedUsers});
  }
}