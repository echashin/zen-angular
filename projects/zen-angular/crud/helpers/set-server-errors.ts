import {AbstractControl, UntypedFormGroup} from '@angular/forms';
import {InputError} from "../interfaces/input-error";

export function setServerErrors(formGroup: UntypedFormGroup, errors: InputError[]): void {
  for (const error of errors) {
    const jsonProperties: string[] = error.property.replace(/\$\.|\$/, '').split(/[\[\].]/g).filter(Boolean);
    let control: AbstractControl | null = formGroup;

    for (const controlName of jsonProperties) {
      control = control?.get(controlName) || null;
    }

    if (control) {
      control.setErrors({ server: error.message })
    }

  }
}