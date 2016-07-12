import {createJobs} from './initialise_DB.ts';
import {Meteor} from 'meteor/meteor';
import './entities.ts';
 
Meteor.startup(function () {
    createJobs();

    console.log('creating methods');

    var filepath = '/Users/michaelbattcock/Desktop/test.txt';

    Meteor.methods({
      'writeFileTest': function () {
        console.log('write file test success!');
        fs.writeFileSync('/Users/michaelbattcock/Desktop/test.txt', "HelloWorld");
      }
    });
});