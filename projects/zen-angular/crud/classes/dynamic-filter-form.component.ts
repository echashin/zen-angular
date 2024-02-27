import {EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FindInput} from "../interfaces/find.input";
import {ZenCrudFilter} from "../interfaces/zen-crud-filter";


export abstract class DynamicFilterFormComponent<T extends object = {}, Out extends object = FindInput> {
  component!: ZenCrudFilter<Out>;

  get form(): FormGroup | undefined {
    if (!this.component.form) {
      console.error('Form is undefined in component:', this.component);
    }
    return this.component.form;
  }

  beforeInit(): void {
  }

  onFormSubmit: EventEmitter<T> = new EventEmitter<T>();
  onFormValueChanges: EventEmitter<Out> = new EventEmitter<Out>();
}
