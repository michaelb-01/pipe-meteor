import { Jobs } from '../collections/jobs.ts';
 
export function loadJobs() {
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
        'public': false
      }
    ];
 
    for (var i = 0; i < jobs.length; i++) {
      Jobs.insert(jobs[i]);
    }
  }
  else {
    console.log('found parties already in database');
  }
}
