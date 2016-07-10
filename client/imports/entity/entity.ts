import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Entities } from '../../../collections/entities';
import { VersionsComponent } from '../version/versions';
import { MeteorComponent } from 'angular2-meteor';

//import { Mongo } from 'meteor/mongo';
//import { Meteor } from 'meteor/meteor';
//import { JobService } from './job.service';

@Component({
  selector: 'entity',
  templateUrl: '/client/imports/entity/entity.html',
  directives: [ ROUTER_DIRECTIVES,
                VersionsComponent ]
})

export class EntityComponent  extends MeteorComponent {
  entityId: string;
  entity: Entity;

  subscription: any;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {
    super();
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.entityId = params['entityId'];

      this.subscribe('entities', () => {
        this.entity = Entities.findOne({'_id':this.entityId});
      }, true);

      console.log(this.entity);
    });
  }
}
