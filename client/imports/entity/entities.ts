import { Component } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Entities } from '../../../collections/entities';
import { Mongo } from 'meteor/mongo';
import { EntityService } from './entity.service';
import { MeteorComponent } from 'angular2-meteor';

import { EntityFormComponent } from './entity-form'; 
import { Tracker } from 'meteor/tracker';

@Component({
  selector: 'entities',
  templateUrl: '/client/imports/entity/entities.html',
  directives: [ ROUTER_DIRECTIVES,
                EntityFormComponent ],
  providers: [ EntityService ]
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

  ngOnInit() {


  }
}

/*

          console.log(this.job);

          if (this.job != null) {
            this.assets = this.job.entities.filter(function (el) {
              return el.type === 'asset';
            });

            this.shots = this.job.entities.filter(function (el) {
              return el.type === 'shot';
            });
          }

*/


