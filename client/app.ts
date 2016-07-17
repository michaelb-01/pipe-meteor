import 'reflect-metadata';
import { Component, provide } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import {disableDeprecatedForms, provideForms} from '@angular/forms'

import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { PartiesList } from './imports/parties-list/parties-list.ts';
import { PartyDetails } from './imports/party-details/party-details.ts';

// import components
import { TopNavComponent} from './imports/top-nav/top-nav.ts';
import { SidebarLeftComponent} from './imports/sidebar-left/sidebar-left.ts';
import { SidebarRightComponent} from './imports/sidebar-right/sidebar-right.ts';

// job
import { JobsComponent } from './imports/job/jobs.ts';
import { JobComponent } from './imports/job/job.ts';
import { JobFormComponent } from './imports/job/job-form.ts';

// entity
import { EntityComponent } from './imports/entity/entity.ts';

// versions
import { VersionsComponent } from './imports/version/versions.ts';

// users
import { UsersComponent } from './imports/user/users.ts';

// shared service
import {SharedService} from './sharedService';

@Component({
  selector: 'app',
  templateUrl: '/client/app.html',
  directives: [TopNavComponent,
               SidebarLeftComponent,
               SidebarRightComponent,
               ROUTER_DIRECTIVES]
})
class Pipe {}

const routes: RouterConfig = [
  { path: '', component: JobsComponent },
  { path: 'job/:jobId', component: JobComponent },
  { path: 'jobForm', component: JobFormComponent },

  { path: 'entity/:entityId', component: EntityComponent},

  { path: 'users', component: UsersComponent },
  { path: 'user/:userId', component: UsersComponent }
];

const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

bootstrap(Pipe, [
  SharedService,
  APP_ROUTER_PROVIDERS, 
  disableDeprecatedForms(),
  provideForms(),
  provide(APP_BASE_HREF, { useValue: '/' })
  ])
.catch((err: any) => console.error(err));
