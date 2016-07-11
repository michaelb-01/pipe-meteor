import 'reflect-metadata';
import { Component } from '@angular/core';
import { FormBuilder, ControlGroup, Validators, Control } from '@angular/common';

import { Jobs } from '../../../collections/jobs.ts';
 
@Component({
  selector: 'job-form',
  templateUrl: '/client/imports/job/job-form.html',
})
export class JobFormComponent { 

  jobForm: ControlGroup;
 
  constructor() {
    let fb = new FormBuilder();
 
    this.jobForm = fb.group({
      name: ['test name',Validators.required],
      client: [''],
      agency: [''],
      public: [false]
    });

    console.log(this.jobForm.controls.name.value);
  }

  addJob(job) {
    if (this.jobForm.valid) {
      console.log(job);

      Jobs.insert({
        name: job.name,
        client: job.client,
        agency: job.agency,
        public: job.public
      });
 
      (<Control>this.jobForm.controls['name']).updateValue('');
      (<Control>this.jobForm.controls['client']).updateValue('');
      (<Control>this.jobForm.controls['agency']).updateValue('');
    }
  }
}