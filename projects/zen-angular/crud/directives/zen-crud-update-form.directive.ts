import {Directive, Input} from '@angular/core';
import {CrudFormDir} from "../classes/crud-form";
import {ZenCrudForm} from "../interfaces/zen-crud-form";
import {FormValue} from "../interfaces/form-value";

@Directive({
  selector: '[zenCrudUpdateForm]'
})
export class ZenCrudUpdateForm<I extends FormValue> extends CrudFormDir<I> {
  @Input() set zenCrudUpdateForm(component: ZenCrudForm<I>) {
    this.component = component;
  }

  getRelations(): string[] | undefined {
    return this.component?.relations && this.component?.relations?.length > 0 ? this.component?.relations : undefined;
  }
}
