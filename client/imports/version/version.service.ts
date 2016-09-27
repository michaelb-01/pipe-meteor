import { Injectable } from '@angular/core';
import { Versions } from '../../../collections/versions';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class VersionService extends MeteorComponent{
  versions: Mongo.Cursor<Version>;
  versions$ = new BehaviorSubject<Mongo.Cursor<Version>>(null);

  version$ = new BehaviorSubject<Version>(null);

  subscription: any;
  subscription2: any;

  constructor() {
    // run the inherited component - MeteorComponent in this case

    // MeteorComponent handles ending the subscription
    // and updating Angular's UI
    super();
  }

  getVersions() {
    this.subscription = this.subscribe('versions', () => {
      this.versions = Versions.find();
      this.versions$.next(Versions.find());
    }, true); // set autoBind to true to auto-update Angular
  }

  getVersionById(versionId) {
    this.subscription2 = this.subscribe('versions', () => {
      this.version$.next(Versions.findOne({"_id":versionId}));
    }, true); // set autoBind to true to auto-update Angular
  }

  addFrameNote(versionId, notes, idx) {
    var frame = notes.frame;

    //delete notes['frame'];

    console.log(versionId);
    console.log(notes);
    console.log(idx);

    var obj = {
      'frame': frame,
      'notes': notes
    }

    if (idx > -1) {

    }
    else {
      //Versions.update({"_id" :versionId },{$push : {"review":obj}});
      Versions.update({"_id" :versionId },{$push : {"review":notes}});
    }
  }
}