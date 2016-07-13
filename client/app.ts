import 'reflect-metadata';
import { Component, provide } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';

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
import { EntityFormComponent } from './imports/entity/entity-form.ts';

// versions
import { VersionsComponent } from './imports/version/versions.ts';

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
  { path: 'entityForm', component: EntityFormComponent }
];

const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

bootstrap(Pipe, [APP_ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
