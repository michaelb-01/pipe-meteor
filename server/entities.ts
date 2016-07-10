import { Entities } from '../collections/entities.ts';
import { Meteor } from 'meteor/meteor';

Meteor.publish("entities", function() {
  return Entities.find({
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
