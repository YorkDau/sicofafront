export interface CitaInterface {
    fechaCita: Date;
    citaHorasList: HoraCitaInterface[];
}
export interface HoraCitaInterface {
    idCita: number;
    horaCita: string;
}
