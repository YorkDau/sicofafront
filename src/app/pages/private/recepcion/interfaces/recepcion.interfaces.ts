export interface RecepcionCita {
  idCita?: number
  idCiudadano?: number
  origenCita?: string
  nombres?: string
  apellidos?: string
  numeroDocumento?: string
  horaCita?: string
  fechaCita?: string
  estado?: string
};
export interface RecepcionCitaFilter {
  nombCiudadano?: string
  primerApellido?: string
  segundoApellido?: string
  numeroDocumento?: string
  codigoCita?: string
  fecha?: string
  estadoCita?: boolean
  idComisaria?: string
};
