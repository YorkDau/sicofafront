export interface TablaSeguimiento {
  idSolicitud: number;
  idTarea: number;
  codsolicitud: string;
  nombresApellidos: string;
  tipoProceso: string;
  numeroDocumento: string;
  tipoDocumento: string;
  fechaSeguimiento: string;
  estado: string;
  codigo: string;
  path: string;
  actividad: string;
  tipoSolicitud: string;
  pathRetorno?: string;
}

export interface PostTablaSeguimiento {
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  numeroDocumento: string;
  codSolicitud: string;
  fecha: string;
  userID: number;
  codPerfil: string;
}

export interface NuevoSeguimiento {
  tipDoc: string;
  nroDoc: string;
  perfil: string;
  solicitud?: string;
  codUsuario?: number;
}

export interface SolicitudPorPersona {
  idSolicitud: number;
  codigoSolicitud: string;
  nombreCompleto: string;
}
