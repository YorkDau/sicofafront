import { FormGroup, ValidationErrors } from '@angular/forms';

export const validarSeguridad = (
  control: FormGroup
): ValidationErrors | null => {
  const chkSeguridad111 = control.get('chkSeguridad111')?.value;
  const chkSeguridad112 = control.get('chkSeguridad112')?.value;
  const chkSeguridad113 = control.get('chkSeguridad113')?.value;
  const chkSeguridad114 = control.get('chkSeguridad114')?.value;
  const chkSeguridad115 = control.get('chkSeguridad115')?.value;
  const chkSeguridad116 = control.get('chkSeguridad116')?.value;
  const chkSeguridad117 = control.get('chkSeguridad117')?.value;
  const chkSeguridad118 = control.get('chkSeguridad118')?.value;
  const chkSeguridad119 = control.get('chkSeguridad119')?.value;

  if (
    !chkSeguridad111 &&
    !chkSeguridad112 &&
    !chkSeguridad113 &&
    !chkSeguridad114 &&
    !chkSeguridad115 &&
    !chkSeguridad116 &&
    !chkSeguridad117 &&
    !chkSeguridad118 &&
    !chkSeguridad119
  ) {
    return { requiredSeguridad: true };
  }

  return null;
};

export const validarRedes = (control: FormGroup): ValidationErrors | null => {
  const chkRedes120 = control.get('chkRedes120')?.value;
  const chkRedes121 = control.get('chkRedes121')?.value;

  if (!chkRedes120 && !chkRedes121) {
    return { requiredRedes: true };
  }

  return null;
};
