export interface TipoRemisionInterface {
  idRemision: number;
  nombre: string;
}

export interface InvolucradoRemision {
  idInvolucrado: number;
  nombres: string;
  documento: string;
}

export interface CargaArchivoRemision {
  entrada: string;
  nombrearchivo: string | null;
  tipoDocumento: string;
  idSolicitudServicio: number;
  idUsuario: number;
  idInvolucrado: number | null;
  idTarea?: number;
}

export interface EditarArvhivoRemision {
  entrada: string;
  idSolicitudServicio: number;
  idSolicitudServicioAnexo: number;
}
