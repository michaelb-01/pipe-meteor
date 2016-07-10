import { Versions } from '../collections/versions.ts';
import { Meteor } from 'meteor/meteor';

Meteor.publish("versions", function() {
  return Versions.find({
    $or: [
      { 'public': true },
      {
        $and: [
          { owner: this.userId },
          { owner: { $exists: true } }
        ]
      }
    ]
  });
});
