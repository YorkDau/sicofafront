import { TiposDocumentoCarga } from '../constants';

export interface CerrarActuacionesInterface {
  userID: number;
  tareaID: number;
  perfilCod: string;
  valorEtiqueta?: string;
}
export interface CrearEtiquetaTareaInterface {
  valorEtiqueta: '1' | '0';
  idsolicitudServicio: number;
  idtarea: number;
}
export interface ArchivarDiligenciasInterface
  extends CerrarActuacionesInterface {
  descripcion: string;
}
export interface CargarArchivoInterface {
  entrada: string;
  idSolicitudServicio: number;
  tipoDocumento?: TiposDocumentoCarga;
  nombrearchivo?: null | string;
}
export interface EditarArchivoInterface {
  entrada: string;
  idSolicitudServicio: number;
  idSolicitudServicioAnexo: number;
}
export interface EliminarArchivoInterface {
  idSolicitudServicio: number;
  idSolicitudServicioAnexo: number;
}
export class ArchivoInterface {
  idSolicitud?: number;
  idArchivo?: number | null;
  nombreArchivo?: string;
  base64?: string;
  mimeType?: 'application/pdf' = 'application/pdf';
}

export interface listaArchivosInterface {
  idFormato: number;
  nombreDocumento: string;
  path: string;
  versionDocumento: number;
  estado: number;
  codigo: string;
}


