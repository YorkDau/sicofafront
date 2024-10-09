import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarIgualdad = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const nuevaPassword = control.get('nuevaPassword')?.value as string;
    const confirmarPassword = control.get('confirmarPassword')?.value as string;

    if (nuevaPassword != confirmarPassword) {
      return { passwordNoEsIgual: true };
    }
    return null;
  };
};

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const valid = regex.test(control.value);

      return valid ? null : error;
    };
  }
}
