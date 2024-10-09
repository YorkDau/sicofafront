import {
  RespuestaEntrevistaRedes,
  SugerenciaApoyo,
} from '../../../../pages/private/interfaces/psicologia.interface';

export interface EntrevistaPsicologicaEmocionalPdfInterface {
  datosIdentificacion1?: {
    nombres?: string;
    apellidos?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
    fechaNacimiento?: string;
    edad?: number;
    servicioSalud?: string;
    escolaridad?: string;
    telefono?: string;
    barrio?: string;
    direccion?: string;
  };
  datosIdentificacion2?: {
    fechaEntrevista?: Date;
    fechaElaboracionInforme?: Date;
    nombreContacto?: string;
    telefonoContacto?: string;
    direccionContacto?: string;
  };
  motivo: RespuestaEntrevistaRedes;
  antecendentesYSituacionActual: RespuestaEntrevistaRedes;
  procedimientoMetodologia: RespuestaEntrevistaRedes;
  relatoDeLosHechos: RespuestaEntrevistaRedes;
  redesApoyo1: RespuestaEntrevistaRedes;
  redesApoyo2: SugerenciaApoyo[];
  redesApoyo3: SugerenciaApoyo[];
  percepcionDeLaVíctima1: RespuestaEntrevistaRedes;
  percepcionDeLaVíctima2: SugerenciaApoyo[];
  conclusionYRecomendacion: RespuestaEntrevistaRedes;
  funcionario?: EntrevistaPsicologicaFuncionario;
}

export interface EntrevistaPsicologicaFuncionario {
  nombre?: string;
  apellido?: string;
  perfil?: string;
  nombreComisaria?: string;
  direccionComisaria?: string;
  ciudad?: string;
  email?: string;
}

export interface DatosIdentificacionEntrevista {
  nombres?: string;
  apellidos?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  fechaNacimiento?: string;
  edad?: number;
  servicioSalud?: string;
  escolaridad?: string;
  telefono?: string;
  barrio?: string;
  direccion?: string;
  fechaEntrevista?: Date;
  fechaElaboracionInforme?: Date;
  nombreContacto?: string;
  telefonoContacto?: string;
  direccionContacto?: string;
  eps?: string;
}

export interface RespuestaEntrevistaAB {
  descripcionA?: string;
  descripcionB?: string;
}
