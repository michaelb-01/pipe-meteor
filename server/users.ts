import { Users } from '../collections/users.ts';
import { Meteor } from 'meteor/meteor';

Meteor.publish("users", function() {
  return Users.find();
});