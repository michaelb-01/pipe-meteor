import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { DynamicFormFieldComponent } from './dynamic-form-field';
import { FieldBase }                 from './field-base';
import { FieldControlService }       from './field-control.service';

@Component({
  selector: 'dynamic-form',
  templateUrl: '/client/imports/dynamic-form/dynamic-form.html',
  directives: [DynamicFormFieldComponent, REACTIVE_FORM_DIRECTIVES],
  providers:  [FieldControlService]
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private _fieldService: FieldControlService) {  }

  ngOnInit() {
    this.form = this._fieldService.toFormGroup(this.fields);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}