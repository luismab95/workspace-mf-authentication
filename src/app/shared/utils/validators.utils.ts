import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswordValidator(
  passwordKey: string,
  confirmPasswordKey: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordKey)?.value;
    const confirmPassword = control.get(confirmPasswordKey)?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
