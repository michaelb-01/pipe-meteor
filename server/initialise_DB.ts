import { Jobs } from '../collections/jobs.ts';
import { Entities } from '../collections/entities.ts';
import { Versions } from '../collections/versions.ts';
import { Users } from '../collections/users.ts';

var users = ['Mike Battcock', 'Ben Cantor', 'Sam Osbourne'];

function createUser(name) {
  var user = {
    'name': name,
    'entities': [{
      'entity': {
        'entityId': '',
        'entityName': ''
      }
    }],
    'email': 'user-email@gmail.com',
    'phone': Math.floor(Math.random() * 1000000000),
    'roles': ['3D','FX'],
    'photoUrl': '',
    'public': true
  }

  var userId = Users.insert(user);
}

export function createUsers () {
  for (var i = 0; i < users.length; i++) {
    createUser(users[i]);
  }
}

var images = ['bmw','clothes','interior','wallSmash','warAndPeace','willYoung'];
var types = ['asset','shot'];

function createVersion(jobId, jobName, entityId, entityName) {
  console.log('create version in ' + entityId);

  var maxNotes = 10;

  var notes = [];
  for (var i=0;i<Math.floor(Math.random() * maxNotes);i++) {
    notes.push(Fake.sentence(Math.floor(Math.random() * 8)));
  }

  var version = {
    'job': {
      'jobId': jobId,
      'jobName': jobName
    },
    'entity': {
      'entityId': entityId,
      'entityName': entityName
    },
    'author': 'Mike Battcock',
    'version': Math.floor((Math.random() * 100) + 1),
    'notes': notes,
    'type': 'still',
    'thumbUrl': images[Math.floor((Math.random() * images.length))] + '.jpg',
    'description': Fake.sentence(7),
    'date': new Date(),
    'public': true
  }

  var versionId = Versions.insert(version);
}

function createEntity(jobId, jobName) {
  console.log('create entity in ' + jobId);

  var entity = {
    'job': {
      'jobId': jobId,
      'jobName': jobName
    },
    'name': Fake.sentence(1),
    'type': types[Math.floor((Math.random() * types.length))],
    'status': 'active',
    'thumbUrl': images[Math.floor((Math.random() * images.length))] + '.jpg',
    'description': Fake.sentence(7),
    'public': true
  }

  var entityId;

  entityId = Entities.insert(entity);

  // random integer between 1 and 10
  var numVersions = Math.floor((Math.random() * 10) + 1);

  // create entities in job
  for (var i = 0; i < numVersions; i++) {
    createVersion(jobId, jobName, entityId, entity.name);
  }
} 
 
export function createJobs() {
  if (Jobs.find().count() === 0) {
    console.log('load default jobs');

    var jobs = [
      {
        'name': 'X-World',
        'client': 'BMW',
        'agency': 'Radical',
        'thumbUrl': 'bmw.jpg',
        'public': true
      },
      {
        'name': 'What The World Needs Now is Love',
        'client': 'Will Young',
        'agency': 'WWF',
        'thumbUrl': 'willYoung.jpg',
        'public': true
      },
      {
        'name': 'War and Peace',
        'client': 'BBC',
        'agency': 'Someone',
        'thumbUrl': 'warAndPeace.jpg',
        'public': true
      }
    ];

    console.log('loaded the following jobs:');

    var jobId = '';
    var numEntities = 1;

    for (var i = 0; i < jobs.length; i++) {
      this.jobId = Jobs.insert(jobs[i]);
      console.log(jobs[i].name);

      // random integer between 1 and 10
      numEntities = Math.floor((Math.random() * 10) + 1);

      // create entities in job
      for (var j = 0; j < numEntities; j++) {
        createEntity(this.jobId, jobs[i].name);
      }
    }
  }
  else {
    console.log('found jobs already in database');
  }
}
