import { Component, NgZone } from '@angular/core';
import { Entities } from '../../../../collections/entities';
import { EntityService } from '../../entity/entity.service';

@Component({
  selector: 'sidebar-left',
  templateUrl: '/client/imports/shared/sidebar-left/sidebar-left.html',
  providers: [ EntityService ]
})

export class SidebarLeftComponent {

  myTasks: Mongo.Cursor<Object>;

  subscription: any;

  constructor(private _entityService: EntityService,
              private ngZone: NgZone) {
    this._entityService.findMyTasks('Mike Battcock');

    Tracker.autorun(() => {
      this.ngZone.run(() => {

        this.subscription = this._entityService.myTasks$.subscribe(myTasks => {
          if (!myTasks) return;   // don't forget this, because you may subscribe the data before you got data from the server

          this.myTasks = myTasks;
          console.log('these are my tasks: ');
          console.log(this.myTasks);
          // do other things
        });
      });
    });
  }

  showSidebarLeft = false;
  toggleSidebarLeft(newState) {
    this.showSidebarLeft = newState;
    console.log('open left sidebar');
  }

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;
  }
}