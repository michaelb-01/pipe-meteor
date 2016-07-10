import { Component } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Versions } from '../../../collections/versions';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';

@Component({
  selector: 'versions',
  templateUrl: '/client/imports/version/versions.html',
  directives: [ ROUTER_DIRECTIVES ]
})

export class VersionsComponent  extends MeteorComponent {
  versions: Mongo.Cursor<Object>;
  subscription: any;

  entityId: string;

  assets = [];
  shots = [];

  constructor(private route: ActivatedRoute) { 
    super();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.entityId = params['entityId'];

      this.subscribe('versions', () => {
        this.versions = Versions.find({ "entity.entityId": this.entityId })
        console.log(this.versions);
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


