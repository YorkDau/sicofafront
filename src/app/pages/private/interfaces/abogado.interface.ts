import { EstadosNotificacionImplicado } from '../../../constants';

export interface ListarSeccionesAuto {
  idDocumento: number;
  nombreDocumento: string;
  orden: number;
  idSeccionDocumento: number;
  nombreSeccion: string;
  tipoMedida: null | string;
  pruebas: null | string;
  idSeccionPadre: number | null;
  padre: string;
}
export interface RemisionInterface {
  idRemision: number;
  nombre: string;
}

export interface ListarSeccionesAuto {
  idDocumento: number;
  nombreDocumento: string;
  orden: number;
  idSeccionDocumento: number;
  nombreSeccion: string;
  tipoMedida: null | string;
  pruebas: null | string;
  idSeccionPadre: number | null;
  padre: string;
}

export interface NotificacionImplicado {
  idInvolucrado: number;
  nombres: string;
  estado: EstadosNotificacionImplicado;
  idAnexo: number;
}

export interface NotificacionMedidaProteccion {
  direccionComisaria: string;
  nombreVictima: string;
  nombreAgresor: string;
  lugarExpedicionVictima: string;
  lugarExpedicionAgresor: string;
  tipoDocVictima: string;
  numeroDocVictima: string;
  nombreNotificado: string;
  tipoDocNotificado: string;
  numeroDocNotificado: string;
  nombreNotificante: string;
  cargo: string;
  ciudadNotificacion?: string;
}
export interface ActualizarEstadoNotificacion {
  idSolicitud?: number;
  /**Si no existe la notificación se le debe crear al involucrado */
  idInvolucrado?: number;
  /**Es la notificación si existe */
  idNotificacion?: number | null;
  /*en caso de que se vaya a generar otras notificaciones por tipo*/
  idReferencia?: number;
  /**audiencia, medida de proteccion, cualquier otra */
  tipoNotificacion?: string;
  nuevoEstado?: string;
}

export interface PruebaCaso {
  idInvolucrado: number;
  tipoPrueba: string;
  nombreInvolucrado: string;
  nombrePrueba: string;
  idAnexo: number;
  idPrueba: number;
  fecha: Date;
}

export interface QuorumAudiencia {
  idInvolucrado: number;
  idTarea: number;
  idAnexo: number;
  idQuorum: number;
  nombreInvolucrado: string;
  esVictima: boolean;
  esPricipal: boolean;
  estado: number;
}

export interface GuardarQuorumAudiencia {
  idSolicitudServicio: number;
  idInvolucrado: number;
  idAnexo: number;
  idEstado: number;
  idTarea: number;
  entrada: string;
  tipoDocumento: string;
  idUsuario: number;
  idQuorum: number;
}

export interface ActualizarQuorumAudiencia {
  idQuorum: number;
  idEstado: number;
  idAnexo: number;
}

export interface actualizarProgramacionQuorum {
  idProgramacion: number;
  idSolicitudServicio: number;
  reprogramada: boolean;
  faltantes: boolean;
}
