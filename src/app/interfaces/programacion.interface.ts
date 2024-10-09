export interface ProgramacionInterface {
  idProgramacion: number;
  idSolicitudServicio: number;
  idTarea: number;
  etiqueta: string;
  razon: string;
  fechaHoraInicial:  string;
  fechaHoraFinal:  string;
  idTipoAudiencia: number;
}

export interface GuardarProgramacionInterface {
  idProgramacion: number | null;
  idSolicitudServicio: number;
  idTarea: number;
  fechaHoraInicial: string ;
  fechaHoraFinal: string;
  idTipoAudiencia: number | null;
}
export interface TipoProgramacionInterface {
  idTipoAudiencia: number;
  descripcion: string;
  etiqueta: string;
}

export interface ItemProgramacionInterface {
  idProgramacion: number;
  codigoSolicitud: string;
  fechaHoraInicial: string;
  fechaHoraFinal: string;
  esAgendaTarea: boolean;
}
