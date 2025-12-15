export interface TomaDecisionInterface {
  idSolicitudServicio: number;
  concilacionPrevia: boolean;
  cumpleConcilacionPrevia?: boolean;
  idEntidadTraslado?: number;
  
  observaciones: string;
  actaConciliacionAnterior: string;
  autoCierre: string;
}
