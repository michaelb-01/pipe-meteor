import { Jobs } from '../collections/jobs.ts';
import { Entities } from '../collections/entities.ts';

var images = ['bmw','clothes','interior','wallSmash','warAndPeace','willYoung'];
var types = ['asset','shot'];

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
        'public': true
  }

  var entityId;

  entityId = Entities.insert(entity);
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
