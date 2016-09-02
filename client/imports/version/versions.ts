import { Component } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Versions } from '../../../collections/versions';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'versions',
  templateUrl: '/client/imports/version/versions.html',
  directives: [ ROUTER_DIRECTIVES ]
})

export class VersionsComponent  extends MeteorComponent {
  versions: Mongo.Cursor<Version>;
  subscription: any;

  entityId: string;

  constructor(private route: ActivatedRoute,
              private _sharedService: SharedService) { 
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

  toggleNotes(version) {
    version.showNotes = !version.showNotes;
    console.log('toggle notes');
  }

  selected: string[] = [];
  select(version) {
    //version.selected = !version.selected;  // toggle selected attribute

    if (version.selected != true) {
      version.selected = true;
      this.selected.push(version._id);
    }
    else {
      version.selected = false;
      var idx = this.selected.indexOf(version._id);
      this.selected.splice(idx, 1);
    }
  }



  editSelected() {
    this._sharedService.edit('form');
  }
  
}




