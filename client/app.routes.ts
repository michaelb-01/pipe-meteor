import { RouterConfig, provideRouter } from '@angular/router';
 
// job
import { JobsComponent } from './imports/job/jobs.ts';
import { JobComponent } from './imports/job/job.ts';
import { JobFormComponent } from './imports/job/job-form.ts';

// entity
import { EntityComponent } from './imports/entity/entity.ts';

// users
import { UsersComponent } from './imports/user/users.ts';
 
const routes: RouterConfig = [
  { path: '', component: JobsComponent },
  { path: 'job/:jobId', component: JobComponent },
  { path: 'jobForm', component: JobFormComponent },

  { path: 'entity/:entityId', component: EntityComponent},

  { path: 'users', component: UsersComponent },
  { path: 'user/:userId', component: UsersComponent }
];
 
export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];