import { Directive, Input } from '@angular/core';
import { CrudFormDir } from "../classes/crud-form";
import { ZenCrudForm } from "../interfaces/zen-crud-form";

@Directive({
    selector: '[zenCrudUpdateManyForm]'
})
export class ZenCrudUpdateManyForm<T extends object> extends CrudFormDir<T> {
    @Input() set zenCrudUpdateManyForm(component: ZenCrudForm<T>) {
        this.component = component;
    }
}
