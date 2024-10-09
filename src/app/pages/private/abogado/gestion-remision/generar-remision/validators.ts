import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarRemisionPersonalizada = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const requiereRemision = control.get('requiereRemision')?.value;
    const nombreRemision = control.get('nombreRemision')?.value;

    if (requiereRemision && nombreRemision.trim() === '') {
      return { requiredRemisionPersonalizada: true };
    }

    return null;
  };
};

export const validarRemisionNoPersonalizada = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const requiereRemision = control.get('requiereRemision')?.value;
    const remision = control.get('remision')?.value;

    if (!requiereRemision && remision === '') {
      return { requiredRemisionNoPersonalizada: true };
    }

    return null;
  };
};
