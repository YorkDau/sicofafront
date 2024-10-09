import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarFechaInicial = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaInicial = control.get('fechaInicial')?.value as Date;
    const fechaFinal = control.get('fechaFinal')?.value as Date;
    const campoFechaInicial = control.get('fechaInicial')?.value as string;
    const campoFechaFinal = control.get('fechaFinal')?.value as string;

    if (campoFechaFinal !== '' && campoFechaInicial !== '') {
      if (fechaFinal < fechaInicial) {
        return { requiredFechaFinalInferiorInicial: true };
      }
    }

    return null;
  };
};

export const validarFechaActualMayorInicial = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaInicial = new Date(control.get('fechaInicial')?.value).getTime();
    const campoFechaInicial = control.get('fechaInicial')?.value as string;
    const fechaActual = new Date().getTime();

    if (campoFechaInicial !== '') {
      if (fechaInicial < fechaActual) {
        return { requiredFechaActualMayorInicial: true };
      }
    }

    return null;
  };
};

export const validarFechaActualMayorFinal = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaFinal = new Date(control.get('fechaFinal')?.value).getTime();
    const campoFechaFinal = control.get('fechaFinal')?.value as string;
    const fechaActual = new Date().getTime();

    if (campoFechaFinal !== '') {
      if (fechaFinal < fechaActual) {
        return { requiredFechaActualMayorFinal: true };
      }
    }

    return null;
  };
};
