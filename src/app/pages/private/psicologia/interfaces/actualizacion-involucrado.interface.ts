import { HijoInvolucrado } from './involucrado.interface';

export interface ActualizacionInvolucrado {
  idInvolucrado?: number;
  ocupacion?: string;
  Escolidad?: number; //idEscolaridad ?: number
  RelacionPareja?: number;
  numeroHijos?: number;
  Cultura?: number; //cultura ?: string
  RelacionAgresor?: number; //relacionAgresor ?: number
  descripcionRelacionAgresor?: string; ////--> Faltante
  TipoDiscapcidad?: number; //idDiscapacidad ?: number
  informacionHijos?: HijoInvolucrado[]; //hijos ?: HijoInvolucrado[];
  descripcionDiscapacidad?: string; //descripcionDiscapacidad ?: string
  embarazo?: string;
  mesesEmbarazo?: number;
  victimaConflicto?: boolean;
  eps?: string;
  ips?: string;
  descripcionOrganizacionCriminal?: string;
  agresorOrganizacionCriminal?: boolean;
  // Nuevos campos:
  idSexo?: number;
  idRelacionPareja?: number;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  nombres?: string;
  apellidos?: string;
  edad?: number;
  idtipoDocumento?: number;
  numeroDocumento?: string;
  idIdentidadGenero?: number;
  edadAproximadaAgresor?: number;
  lugarExpedicion?: number;
  fechaExpedicion?: Date;
  fechaNacimiento?: Date;
}
