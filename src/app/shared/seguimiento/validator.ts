import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarNombreCompleto = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const nombres = control.get('nombres')?.value.trim();
    const primerApellido = control.get('primerApellido')?.value.trim();

    if (nombres === '' && primerApellido !== '') {
      return { requiredNombres: true };
    }

    return null;
  };
};

export const validarPrimerApellido = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const nombres = control.get('nombres')?.value.trim();
    const primerApellido = control.get('primerApellido')?.value.trim();

    if (nombres !== '' && primerApellido === '') {
      return { requiredPrimerApellido: true };
    }

    return null;
  };
};

export const validarSegundoApellido = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const nombres = control.get('nombres')?.value.trim();
    const primerApellido = control.get('primerApellido')?.value.trim();
    const segundoApellido = control.get('segundoApellido')?.value.trim();

    if (nombres === '' && primerApellido === '' && segundoApellido !== '') {
      return { requiredSegundoApellido: true };
    }

    return null;
  };
};
