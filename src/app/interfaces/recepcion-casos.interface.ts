export interface RecepcionCasosInterface {
  idSolicitud: number;
  idTarea: number;
  codsolicitud: string;
  nombresApellidos: string;
  tipoProceso: string;
  tipoSolicitud: string;
  numeroDocumento: number;
  fechaSolicitud: string;
  estado: string;
  riesgo: number;
  path: string;
  ciudadanoID: number;
  pathRetorno: string | undefined;
  actividad: string;
  remision?: number;
}
