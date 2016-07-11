import 'reflect-metadata';
import { Component, Input } from '@angular/core';
import { FormBuilder, ControlGroup, Validators, Control } from '@angular/common';

import { Entities } from '../../../collections/entities.ts';
 
@Component({
  selector: 'entity-form',
  templateUrl: '/client/imports/entity/entity-form.html',
})
export class EntityFormComponent { 

  entityForm: ControlGroup;

  @Input() jobId: string;
  @Input() jobName: string;
 
  constructor() {
    console.log(this.jobName);

    let fb = new FormBuilder();
 
    this.entityForm = fb.group({
      name: ['',Validators.required],
      type: ['shot'],
      status: [''],
      thumbUrl: [''],
      description: [''],
      public: [true]
    });

    console.log(this.entityForm.controls.name.value);
  }

  addEntity(entity) {
    console.log(this.jobId);
    console.log(this.jobName);

    if (this.entityForm.valid) {
      console.log(entity);

      Entities.insert({
        job: {
          jobId: this.jobId,
          jobName: this.jobName
        },
        name: entity.name,
        type: entity.type,
        status: entity.status,
        thumbUrl: entity.thumbUrl,
        description: entity.description,
        public: entity.public
      });
    }
  }
}


