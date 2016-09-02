import 'reflect-metadata';
import { Component, provide } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { disableDeprecatedForms, provideForms} from '@angular/forms'

import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

// shared components
import { TopNavComponent} from './imports/shared/top-nav/top-nav.ts';
import { SidebarLeftComponent} from './imports/shared/sidebar-left/sidebar-left.ts';
import { SidebarRightComponent} from './imports/shared/sidebar-right/sidebar-right.ts';

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
import { SharedService } from './imports/shared/shared.service';
import { JobSharedService } from './imports/shared/job-shared.service';

@Component({
  selector: 'app',
  templateUrl: '/client/app.html',
  directives: [ TopNavComponent,
                SidebarLeftComponent,
                SidebarRightComponent,
                ROUTER_DIRECTIVES ]
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
  JobSharedService,
  APP_ROUTER_PROVIDERS, 
  disableDeprecatedForms(),
  provideForms(),
  provide(APP_BASE_HREF, { useValue: '/' })
  ])
.catch((err: any) => console.error(err));
