export interface PsicologiaInterface {
  codigo: number;
  nombre: string;
  apellido: string;
  documento: string;
  hora: string;
  fecha: Date;
}

export interface RegistrarRecomendacionesValoracionRiesgo {
  idSolicitudServicio?: number;
  decripcion?: string;
  file?: File;
}

export interface SugerenciaApoyo {
  idDominio: number;
  nombreDominio: string;
  respuesta: boolean;
}

export interface RespuestaEntrevistaRedes {
  idSolicitudServicio: number;
  tipoDominio: string;
  descripcionA: string;
  descripcionB: string;
  respuestas: Respuesta[];
}

export interface Respuesta {
  idDominio: number;
  respuesta: boolean;
}

export interface ActualizarDatosIdentificacionInterface {
  idSolicitudServicio?: number
  idInvolucrado?: number
  fechaEntrevista?: string
  fechaElaboracionInforme?: string
  nombreContacto?: string
  telefonoContacto?: string
  direccionContacto?: string
}

export interface ValoracionRiesgo {
  indicadorRiesgo: string;
  puntuacion: number;
  descripcion?: string;
}
