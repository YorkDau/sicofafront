export interface TomaDecisionInterface {
  idSolicitudServicio: number;
  concilacionPrevia: boolean;
  cumpleConcilacionPrevia?: boolean;
  idEntidadTraslado?: number;
  
  observaciones: string;
  actaConciliacionAnterior: string;
  autoCierre: string;
}


export interface TomaDecisionInformacionInterface {
  idSolicitudServicio: number;
  cierre: boolean;
  esNecesarioRemitir?: boolean;
  observaciones: string;
  autoCierre: string;
}
