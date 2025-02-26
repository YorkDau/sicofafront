export interface ReporteSolicitudInterface {
  numeroDocumento: string | null;
  codigoTipoDocumento: string | null;
  codigoSolicitud: string | null;
  fechaSolicitudDesde: string | null;
  fechaSolicitudHasta: string | null;
  
  nombreCompletoVictima: string | null;
  nombreCompletoVictimario: string | null;
  sexoVictima: string | null;
  identidadGeneroVictima: string | null;
  fechaHechoViolento: Date | null;
  horaHechoViolento: Date | null;
}
