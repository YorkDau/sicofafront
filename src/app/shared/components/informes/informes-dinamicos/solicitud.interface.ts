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
  pard_generar : boolean;
  id_comisaria: number | null;
  horaHechoViolento: Date | null;
}
