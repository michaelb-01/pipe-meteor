import { Jobs } from '../collections/jobs.ts';
import { Meteor } from 'meteor/meteor';

Meteor.publish("jobs", function() {
  return Jobs.find({ 'public': true });
});