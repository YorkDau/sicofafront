



export interface PostDataProgramacionAudiencia {
  idSolicitud: number;
  idTarea: number;
  idTarea_uso: number;
  etiqueta: string | undefined;
  razon: string;
  fechaInicial: string;
  fechaFinal: string;
  estado: string;
  usuarioModifica: number;
}

export interface EtiquetaTareaSolicitud {
  idsolicitudServicio: number;
  valorEtiqueta: '1' | '0';
  estado: 'ABIERTA' | 'CERRADO';
}
