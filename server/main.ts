import {loadJobs} from './load-jobs.ts';
import {Meteor} from 'meteor/meteor';
 
Meteor.startup(loadJobs);