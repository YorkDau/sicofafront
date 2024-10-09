export interface listaMedidasInterface {
    idSeguimiento: number;
    idSolicitudServicio: number;
    idProgramacion: number;
    comentario: string;
    idTareaInstrumentros: number | null;
    usuarioModifica: number;
    medidasDeProteccion: MedidasInterface[];
    medidasDeAtencion: MedidasInterface[];
    medidasDeEstabilizacion: MedidasInterface[];
    medidasDeProteccionEntidad: MedidasInterface[];
}

export interface MedidasInterface{
    idseguimientoMedidas: number;
    idMedida: number;
    estadoMedida: string;
    prorroga: string | null;
    justificacionProrroga: string | null;
    nomMedida: string;
    textoMedida: string;
    tipoMedida: number;
    idAnexoProrroga: number | null;
    nombreAnexoProrroga: string | null;
}
