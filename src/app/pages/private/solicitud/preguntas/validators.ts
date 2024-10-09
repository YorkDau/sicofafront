import { FormGroup, ValidationErrors } from '@angular/forms';

export const validarClasifiqueTramite = (
  control: FormGroup
): ValidationErrors | null => {
  const esCompetenciaComisaria = control.get('esCompetenciaComisaria')?.value as string;
  const idtipoTramite = control.get('idtipoTramite')?.value as string;

  if (esCompetenciaComisaria === 'si' && idtipoTramite === '') {
    return { requiredTramite: true };
  }
  return null;
};

export const validarContextoFamiliar = (
  control: FormGroup
): ValidationErrors | null => {
  const esCompetenciaComisaria = control.get('esCompetenciaComisaria')?.value as string;
  const idContextofamiliar = control.get('idContextofamiliar')?.value as string;

  if (esCompetenciaComisaria === 'si' && idContextofamiliar === '') {
    return { requiredContextoFamiliar: true };
  }
  return null;
};

export const validarJustifique = (
  control: FormGroup
): ValidationErrors | null => {
  const esCompetenciaComisaria = control.get('esCompetenciaComisaria')?.value as string;
  const noCompetenciaDescripcion = control.get('noCompetenciaDescripcion')?.value as string;

  if (esCompetenciaComisaria === 'no' && noCompetenciaDescripcion === '') {
    return { requiredJustifique: true };
  }
  return null;
};
