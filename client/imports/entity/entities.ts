import { Component } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Entities } from '../../../collections/entities';
import { Mongo } from 'meteor/mongo';
import { EntityService } from './entity.service';
import { MeteorComponent } from 'angular2-meteor';

import { Tracker } from 'meteor/tracker';

import { SharedService } from '../shared/shared.service';

import { FilterPipe } from '../shared/filter.pipe';
import { FirstLetterPipe } from '../shared/first-letter.pipe';

import { SearchBox } from '../shared/search_box';

@Component({
  selector: 'entities',
  templateUrl: '/client/imports/entity/entities.html',
  directives: [ ROUTER_DIRECTIVES,
                SearchBox ],
  providers: [ EntityService ],
  pipes: [ FilterPipe, FirstLetterPipe ]
})

export class EntitiesComponent  extends MeteorComponent {
  entities: Mongo.Cursor<Object>;

  first: Object;

  subscription: any;

  jobId: string;

  tracker: any;

  assets = [];
  shots = [];

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

            this.entities.forEach((item, index) => {
              if (index == 0) {
                this.first = item;
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

  ngOnInit() {}

  selected: string[] = [];
  select(entity) {
    entity.selected = !entity.selected;  // toggle selected attribute

    var idx = this.selected.indexOf(entity._id);

    if (idx > -1) {
      this.selected.splice(idx, 1);
    }
    else {
      this.selected.push(entity._id);
    }

    console.log(entity);

    this._sharedService.updateSel({"id":entity._id, "name":entity.name}, 'entity');
  }

  editSelected() {

    console.log('edit selected');
  }

  showDetails = false;
  showTaskDetails() {
    this.showDetails = !this.showDetails;
  }
}


