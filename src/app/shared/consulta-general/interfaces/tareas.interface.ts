export interface InformacionGeneralInterface{
    idSolicitudServicio: string;
    fechaSolicitud: string;
    relatoHechos: string;
    estadoSolicitud: string;
    subestadoSolicitud: string;
    involucrados: InvolucradosInterface[];
    tareas: TareasInterface[];
    anexos: AnexosInterface[];
}

export interface InvolucradosInterface {
    idInvolucrado: number;
    nombres: string;
    numeroDocumento: string;
    tipoDocumento: number;
    tipoInvolucrado: string;
}
export interface TareasInterface {
    estadoTarea: string;
    fechaCreacion: string;
    fechaTerminacion: string;
    idTarea: number;
    nombreProceso: string;
    nombreTarea: string;
    usuario: string;
}
export interface AnexosInterface {
    fechaCreacion: string;
    idAnexo: number;
    nombreArchivo: string;
    nombreDocumento: string;
}