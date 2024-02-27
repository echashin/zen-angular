import { Directive, Input } from '@angular/core';

import { CrudFormDir } from "../classes/crud-form";
import { ZenCrudForm } from "../interfaces/zen-crud-form";
import { FormValue } from "../interfaces/form-value";

@Directive({
    selector: '[zenCrudCreateForm]'
})
export class ZenCrudCreateForm<I extends FormValue> extends CrudFormDir<I> {
    @Input() set zenCrudCreateForm(component: ZenCrudForm<I>) {
        this.component = component;
    }
}
