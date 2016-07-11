import { Component } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Entities } from '../../../collections/entities';
import { Mongo } from 'meteor/mongo';
import { EntityService } from './entity.service';
import { MeteorComponent } from 'angular2-meteor';

import { EntityFormComponent } from './entity-form'; 

@Component({
  selector: 'entities',
  templateUrl: '/client/imports/entity/entities.html',
  directives: [ ROUTER_DIRECTIVES,
                EntityFormComponent ],
  providers: [ EntityService ]
})

export class EntitiesComponent  extends MeteorComponent {
  entities: Mongo.Cursor<Entity>;

  first: Object;

  subscription: any;

  jobId: string;

  assets = [];
  shots = [];

  constructor(private _entityService: EntityService,
              private route: ActivatedRoute) { 
    super();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.jobId = params['jobId'];

      this.subscribe('entities', () => {
        var idx = 0;
        this.entities = Entities.find({ "job.jobId": this.jobId }).forEach((item) => {
          if (idx == 0) {
            this.first = item;
          }
          // sort into assets and shots
          if (item.type === 'asset') {
            this.assets.push(item);
          }
          else if (item.type === 'shot') {
            this.shots.push(item);
          }

          idx += 1;
        });
      }, true);
    });

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


