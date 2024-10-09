export interface SolicitudInterface {
  id_entidad_externa: number;
  codigo_entidad_extera: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface EntidadInterface {
  id_entidad_externa: number;
  codigo_entidad_extera: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface ComisariaInterface {
  id_comisaria: number;
  codigo_comisaria: number;
  nombre: string;
}

export interface SolicitudCiudadanoInterface {
  idCiudadano: number;
  idComisaria: number;
  fechaSolicitud: string;
  horaSolicitud: string;
  fechaHechoViolento: string;
  descripcionHechos: string;
  esVictima: boolean;
  conviveConAgresor: boolean;
  relacionParentescoAgresor: number;
  esCompetenciaComisaria: boolean;
  noCompetenciaDescripcion?: string;
  idtipoTramite?: number;
  idContextofamiliar?: number;
  esNecesarioRemitir?: boolean;
  idComisariaRemision?: number;
  idEntidadExterna?: number;
  justificacionRemision?: string;
  idUsuarioSistema: number;
  idSolicitud?: number;
}
