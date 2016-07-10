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

// job
import { JobsComponent } from './imports/job/jobs.ts';
import { JobComponent } from './imports/job/job.ts';

// entity
import { EntityComponent } from './imports/entity/entity.ts';

@Component({
  selector: 'app',
  templateUrl: '/client/app.html',
  directives: [TopNavComponent,
               SidebarLeftComponent,
               ROUTER_DIRECTIVES]
})
class Pipe {}

const routes: RouterConfig = [
  { path: '', component: JobsComponent },
  { path: 'job/:jobId', component: JobComponent },
  { path: 'job/:jobId/entity/:entityName', component: EntityComponent}
];

const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

bootstrap(Pipe, [APP_ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
