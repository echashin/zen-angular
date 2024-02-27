import {AfterViewInit, Directive, Input} from '@angular/core';
import {DynamicFilterFormComponent} from "../classes/dynamic-filter-form.component";
import {ZenCrudFilter} from "../interfaces/zen-crud-filter";
import {FindInput} from "../interfaces/find.input";
import {distinctUntilChanged} from "rxjs/operators";

@Directive({
  selector: '[zenCrudFilterForm]'
})
export class ZenCrudFilterForm<T extends object = {}, Out = FindInput> extends DynamicFilterFormComponent<T> implements AfterViewInit {
  @Input() set zenCrudFilterForm(component: ZenCrudFilter<T>) {
    this.component = component;
  }

  ngAfterViewInit(): void {
    this.beforeInit();
    if (this.form) {
      //emit default values (also emit values after 'set value')
      this.onFormValueChanges.emit(this.component.mapSearch(this.form.value));

      this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((filters: T) => {
        this.onFormSubmit.emit(filters);
        this.onFormValueChanges.emit(this.component.mapSearch(filters));
      });
    }
  }
}
