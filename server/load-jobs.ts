import { Jobs } from '../collections/jobs.ts';
 
export function loadJobs() {
  if (Jobs.find().count() === 0) {
    console.log('load default jobs');

    var entities = [
      {
        'name': 'sh0010',
        'type': 'shot',
        'status': 'active',
        'thumbUrl': 'warAndPeace.jpg',
        'public': true
      },
      {
        'name': 'sh0020',
        'type': 'shot',
        'status': 'pending review',
        'thumbUrl': 'bmw.jpg',
        'public': true
      },
      {
        'name': 'wreckingBall',
        'type': 'asset',
        'status': 'active',
        'thumbUrl': 'willYoung.jpg',
        'public': true
      }
    ]

    var jobs = [
      {
        'name': 'X-World',
        'client': 'BMW',
        'agency': 'Radical',
        'thumbUrl': 'bmw.jpg',
        entities,
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
 
    for (var i = 0; i < jobs.length; i++) {
      Jobs.insert(jobs[i]);
    }

    console.log('loaded the following jobs: ' + jobs);
  }
  else {
    console.log('found jobs already in database');
  }
}
