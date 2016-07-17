import {createJobs, createUsers} from './initialise_DB.ts';
import {Meteor} from 'meteor/meteor';
import './entities.ts';
 
Meteor.startup(function () {
    createJobs();
    createUsers();

    var filepath = '/Users/michaelbattcock/Desktop/test.txt';

    Meteor.methods({
      'writeFileTest': function () {
        console.log('write file test success!');
        fs.writeFileSync('/Users/michaelbattcock/Desktop/test.txt', "HelloWorld");
      }
    });
});