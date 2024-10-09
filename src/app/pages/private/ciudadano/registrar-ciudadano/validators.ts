import { FormGroup, ValidationErrors } from '@angular/forms';
import { Regex } from 'src/app/constants';

export const validarDiscapacidad = (
  control: FormGroup
): ValidationErrors | null => {
  const rDiscapacidad = control.get('rDiscapacidad')?.value;
  const discapacidad = control.get('discapacidad')?.value;

  if (rDiscapacidad === 'si' && discapacidad == '') {
    return { requiredDiscapacidad: true };
  }

  return null;
};

export const validarIndigena = (
  control: FormGroup
): ValidationErrors | null => {
  const chkIndigena = control.get('chkIndigena')?.value;
  const indigena = control.get('indigena')?.value as string;

  if ((chkIndigena && indigena == '') || indigena === null) {
    return { requiredIndigena: true };
  }
  return null;
};

export const validarDatosContacto = (
  control: FormGroup
): ValidationErrors | null => {
  const telefono = control.get('telefono')?.value as string;
  const celular = control.get('celular')?.value as string;
  const correo = control.get('correoElectronico')?.value as string;

  if (telefono === '' && celular === '' && correo === '') {
    return { requiredDatosContacto: true };
  }
  return null;
};

export const validarDepartamento = (
  control: FormGroup
): ValidationErrors | null => {
  const pais = control.get('pais')?.value;
  const departamento = control.get('departamento')?.value;

  if (pais == 1 && departamento == '') {
    return { requiredDepartamento: true };
  }
  return null;
};

export const validarMunicipio = (
  control: FormGroup
): ValidationErrors | null => {
  const pais = control.get('pais')?.value;
  const departamento = control.get('departamento')?.value;
  const municipio = control.get('municipio')?.value;

  if (pais == 1 && departamento !== '' && municipio == '') {
    return { requiredMunicipio: true };
  }
  return null;
};

export const localidadEsBogota = (
  control: FormGroup
): ValidationErrors | null => {
  const municipio = control.get('municipio')?.value;
  const localidad = control.get('localidad')?.value;

  if (municipio == 1 && localidad == '') {
    return { requiredlocalidad: true };
  }
  return null;
};

export const validarEmbarazo = (
  control: FormGroup
): ValidationErrors | null => {
  const rEmbarazo = control.get('rEmbarazo')?.value as string;
  const embarazo = control.get('embarazo')?.value as string;

  if (rEmbarazo === 'si' && embarazo == '') {
    return { requiredEmbarazo: true };
  }
  return null;
};

export const validarAfiliado = (
  control: FormGroup
): ValidationErrors | null => {
  const rAfiliado = control.get('rAfiliado')?.value as string;
  const eps = control.get('eps')?.value as string;
  const ips = control.get('ips')?.value as string;

  if (rAfiliado === 'si' && eps === '' && ips === '') {
    return { requiredAfiliado: true };
  }
  return null;
};

export const validarCorreo = (
  control: FormGroup
): ValidationErrors | null => {
  const correo = control.get('correoElectronico')?.value as string;
  
  
  if (correo != '' && !Regex.EMAIL.test(correo)) {
    
    return { requiredFormatoCorreo: true };
  }
  return null;
};
