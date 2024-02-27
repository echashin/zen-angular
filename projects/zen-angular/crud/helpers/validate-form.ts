import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {isAfter, parse} from 'date-fns';
import {TIME_FORMAT} from "../config/date-time-formats.config";


export function validateForm(formGroup: FormGroup): void {
  for (const field of Object.keys(formGroup.controls)) {
    formGroup.markAllAsTouched();
    formGroup.updateValueAndValidity();
    const control: AbstractControl | FormControl | null | FormGroup = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({onlySelf: true});
      control.updateValueAndValidity();
    } else if (control instanceof FormGroup) {
      validateForm(control);
    }
  }
}

export function requiredIfValidator(predicate: () => boolean): ValidatorFn {
  return (formControl: AbstractControl): ValidationErrors | null => {
    if (!formControl.parent) {
      return null;
    }
    if (predicate()) {
      return Validators.required(formControl);
    }
    return null;
  };
}

export function validationTime(predicate: () => string): ValidatorFn {
  return (formControl: AbstractControl): ValidationErrors | null => {
    const startTime: string = predicate();
    if (!startTime || !formControl.value) {
      return null;
    }
    if (isAfter(parse(startTime, TIME_FORMAT, new Date()), parse(formControl.value, TIME_FORMAT, new Date()))) {
      return {timeError: "Wrong time: The 'End Time' must be after the 'Start Time'."};
    }
    return null;
  };
}


export function getErrors(formGroup: FormGroup, errors: any = {}) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      errors[field] = control.errors;
    } else if (control instanceof FormGroup) {
      errors[field] = getErrors(control);
    }
  });
  return errors;
}
