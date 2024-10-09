export interface InvolucradoDTO {
  id?: number;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  fechaNacimiento?: Date;
  tipoDocumento?: number;
  numeroDocumento?: string;
  sexo?: number;
  identidadGenero?: number;
  ocupacion?: string;
  idEscolaridad?: number;
  numeroHijos?: number;
  relacionPareja?: number;
  relacionAgresor?: number;
  descripcionRelacionAgresor?: string;
  cultura?: number;
  agresorConflicto?: boolean;
  agresorconflictoDescripcion?: string;
  idDiscapacidad?: number;
  descripcionDiscapacidad?: string;
  embarazo?: string;
  mesesEmbarazo?: number;
  edadAproximadaAgresor?: number;
  victimaConflicto?: boolean;
  eps?: string;
  ips?: string;
  hijos?: HijoInvolucrado[];
  descripcionOrganizacionCriminal?: string;
  agresorOrganizacionCriminal?: boolean;
  telefono?: string;
  direccionRecidencia?: string;
  lugarExpedicion?: number;
  fechaExpedicion?: Date;
  nombres?: string;
  apellidos?: string;
  idGenero?: number;
  telefonoContactoConfianza?: null;
  firma?: null;
}

export interface HijoInvolucrado {
  edad?: number;
  sexo?: number;
  custodia?: number;
}

export interface FormTipoViolenciaInterface {
  idQuestionario: number;
  idTipoViolencia: number;
  descripcion: string;
  esCerrada: boolean;
  puntuacion: number;
  puntuacionPrevio: number;
  mesPrevio: boolean;
  tipoViolencia?: string;
}

export interface RespuestaTipoViolencia {
  idSolicitudServicio: number;
  idTipoViolencia: number;
  listadoRespuestas: ListadoRespuesta[];
  idTarea: number;
}

export interface ListadoRespuesta {
  idCuestionario: number;
  mes: boolean;
  puntuacion: boolean;
}
