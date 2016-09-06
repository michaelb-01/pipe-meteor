import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Entities } from '../../../collections/entities';
import { VersionsComponent } from '../version/versions';
import { MeteorComponent } from 'angular2-meteor';

import { EntityService } from './entity.service';

//import { Mongo } from 'meteor/mongo';
//import { Meteor } from 'meteor/meteor';
//import { JobService } from './job.service';

@Component({
  selector: 'entity',
  templateUrl: '/client/imports/entity/entity.html',
  directives: [ ROUTER_DIRECTIVES,
                VersionsComponent ],
  providers: [ EntityService ]
})

export class EntityComponent  extends MeteorComponent {
  entityId: string;
  entity: Entity;

  subscription: any;

  constructor(private route: ActivatedRoute,
              private _entityService: EntityService ) {
    super();
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.entityId = params['entityId'];

      this._entityService.getEntityById(this.entityId);

      this.subscription = this._entityService.entity$.subscribe(entity => {
        if (!entity) return;   // don't forget this, because you may subscribe the data before you got data from the server

        this.entity = entity;
        // do other things
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}


