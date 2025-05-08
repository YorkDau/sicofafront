import type { HijoInvolucrado } from './involucrado.interface';

export interface ActualizacionInvolucrado {
  idInvolucrado?: number;
  ocupacion?: string;
  Escolidad?: number;
  RelacionPareja?: number;
  numeroHijos?: number;
  Cultura?: number;
  RelacionAgresor?: number;
  descripcionRelacionAgresor?: string;
  TipoDiscapcidad?: number;
  informacionHijos?: HijoInvolucrado[];
  descripcionDiscapacidad?: string;
  embarazo?: string;
  mesesEmbarazo?: number;
  victimaConflicto?: boolean;
  victimaDesplazamiento?: boolean;
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
  // lugarExpedicion?: number;
  paisExp?: number;
  departamentoExp?: number;
  municipioExp?: number;
  fechaExpedicion?: Date;
  fechaNacimiento?: Date;
}
