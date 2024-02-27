import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export function validateForm(formGroup: UntypedFormGroup): void {
  for (const field of Object.keys(formGroup.controls)) {
    formGroup.markAllAsTouched();
    formGroup.updateValueAndValidity();
    const control: AbstractControl | UntypedFormControl | null | UntypedFormGroup = formGroup.get(field);
    if (control instanceof UntypedFormControl) {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    } else if (control instanceof UntypedFormGroup) {
      validateForm(control);
    }
  }
}
