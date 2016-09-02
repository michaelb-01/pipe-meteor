import { Component, Input } from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { FieldBase }     from './field-base';

@Component({
  selector: 'df-question',
  templateUrl: '/client/imports/dynamic-form/dynamic-form-field.html',
  directives: [REACTIVE_FORM_DIRECTIVES]
})

export class DynamicFormFieldComponent {
  @Input() field: FieldBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.field.key].valid; }
}