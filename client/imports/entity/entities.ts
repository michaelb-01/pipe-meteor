import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Entities } from '../../../collections/entities';
import { Mongo } from 'meteor/mongo';
import { EntityService } from './entity.service';
import { EntityFormComponent } from './entity-form';

import { MeteorComponent } from 'angular2-meteor';

import { Tracker } from 'meteor/tracker';

import { SharedService } from '../shared/shared.service';

import { FilterPipe } from '../shared/filter.pipe';
import { NullPipe } from '../shared/null.pipe';
import { FirstLetterPipe } from '../shared/first-letter.pipe';

import { SearchBox } from '../shared/search_box';

@Component({
  selector: 'entities',
  templateUrl: '/client/imports/entity/entities.html',
  directives: [ ROUTER_DIRECTIVES,
                EntityFormComponent,
                SearchBox ],
  providers: [ EntityService ],
  pipes: [ FilterPipe,  NullPipe, FirstLetterPipe ]
})

export class EntitiesComponent  extends MeteorComponent {
  entities: Mongo.Cursor<Object>;

  testFilter = 1;

  first: Object;

  subscription: any;

  jobId: string;

  tracker: any;

  assets = [];
  shots = [];

  selected = [];

  constructor(private _entityService: EntityService,
              private _sharedService: SharedService,
              private route: ActivatedRoute) { 
    super();

    this.route.params.subscribe((params) => {
      

      this.subscribe('entities', () => {
        this.jobId = params['jobId'];

          this.tracker = Tracker.autorun(() => {
            // Reset lists
            this.assets.length = 0;
            this.shots.length = 0;
            
            // Update lists
            this.entities = Entities.find({ "job.jobId": this.jobId });

            this._entityService.test();

            this.entities.forEach((item, index) => {
              if (index == 0) {
                this.first = item;
                console.log(item);
              }
              // sort into assets and shots
              if (item.type === 'asset') {
                this.assets.push(item);
              } else if (item.type === 'shot') {
                this.shots.push(item);
              }
            });
          });

      }, true);

    });
  }

  shiftDown = false;
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event) {
    if (event.keyCode == 16) {
      this.shiftDown = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    if (event.keyCode == 16) {
      this.shiftDown = false;
    }
  }

  select(entity,task,assetId,taskId) {
    console.log(entity);

    var obj = { "id":entity._id, "type":task.type, "name":entity.name, "entityType":entity.type, "assetId":assetId, "taskId":taskId };

    if (this.shiftDown == false) {

      if (entity.type == 'asset') {
        this.assets.forEach((asset) => {
          asset.tasks.forEach((task) => {
            task.selected = false;
          });
        });
      }
      else {
        this.shots.forEach((shot) => {
          shot.tasks.forEach((task) => {
            task.selected = false;
          });
        });
      }

      task.selected = true;

      this.selected = [];
      this.selected.push(obj);

      return;
    }

    task.selected = !task.selected;  // toggle selected attribute

    var contains = false;

    var i;
    for (i = 0; i < this.selected.length; i++) {
      if (this.selected[i].id + this.selected[i].type == obj.id + obj.type) {
        contains = true;
        break;
      }
    }

    if (contains == true) {
      this.selected.splice(i, 1);
    }
    else {
      this.selected.push(obj);
    }

    //this.selected.push(entity);

    console.log(this.selected);
    console.log('index: ' + i);

    //this._sharedService.updateSel({"id":entity._id, "type":task.type, "name":entity.name}, 'entity');
  }

  editSelected() {

    console.log('edit selected');
  }

  showDetails = false;
  showTaskDetails() {
    this.showDetails = !this.showDetails;
  }

  onAssign(event) {
    //this.assets[0].tasks.splice(1,1);

    if (this.selected.length < 1) {
      console.log('no tasks selected');
      return;
    }
    else if (event.users.length < 1) {
      console.log('no users selected');
      return;
    }

      // iterate over selected users
      event.users.forEach((selUser) => {

        for (var i = 0; i < this.selected.length; i++) {
          if (this.selected[i].entityType == 'asset') {
            // iterate over selected tasks
            var assetId = this.selected[i].assetId;
            var taskId = this.selected[i].taskId;

            var found = false;

            var j;
            for (j = 0; j < this.assets[assetId].tasks[taskId].users.length; j++) {
               if (this.assets[assetId].tasks[taskId].users[j].name == selUser.name) {
                found = true;
                console.log('found: ' + selUser + ' in ' + this.assets[assetId]);
                break;
              }
            }

            if (found == false) {
              if (event.mode == true) {
                this.assets[assetId].tasks[taskId].users.push({"name":selUser.name});
                this._entityService.assignUser(this.assets[assetId]._id, taskId, selUser.name);
              }
            }
            else {
              if (event.mode == false) {
                this.assets[assetId].tasks[taskId].users.splice(j,1);
                this._entityService.unassignUser(this.assets[assetId]._id, taskId, selUser.name);
              }
            }
          }
        }
      });

      //this.assets = [];
    
  }

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;
  }
}


