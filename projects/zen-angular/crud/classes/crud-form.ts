import { EventEmitter } from '@angular/core';
import { FormGroup } from "@angular/forms";
import {InputError} from "../interfaces/input-error";
import { removeServerErrors, setServerErrors, getErrors, validateForm } from "../helpers";
import { ZenCrudForm } from "../interfaces/zen-crud-form";
import { FormValue } from "../interfaces/form-value";


export class CrudFormDir<I extends FormValue> {
    component!: ZenCrudForm<I>;

    get form(): FormGroup | undefined {
        if (!this.component.form) {
            console.error('Form is undefined in component:', this.component);
        }
        return this.component.form;
    }

    reset(resetValue?: I): void {
        if (!this.form) {
            return;
        }
        this.form.reset(resetValue ?? this.component.defaultFormValue);
    }

    setFormValue(value: I): void {
        if (!this.form) {
            return;
        }
        this.form.patchValue(this.component.beforePatch ? this.component.beforePatch(value) : value);
    }

    setErrors(errors: InputError[] | null): void {
        if (!this.form) {
            return;
        }
        if (!errors || errors.length === 0) {
            removeServerErrors(this.form);
        } else {
            setServerErrors(this.form, errors);
        }
    }

    submitForm(): void {
        if (!this.form) {
            return;
        }

        validateForm(this.form);

        if (this.form.valid) {
            this.onFormSubmit.emit(this.component.beforeSubmit ? this.component.beforeSubmit(this.form.value) : this.form.value);
        } else {
            console.log('Form not valid', getErrors(this.form));
        }
    }

    onFormSubmit: EventEmitter<I> = new EventEmitter<I>();
}
