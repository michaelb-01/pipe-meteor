import {createJobs} from './initialise_DB.ts';
import {Meteor} from 'meteor/meteor';
import './entities.ts';
 
Meteor.startup(createJobs);