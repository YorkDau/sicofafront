import { CitaInterface } from "./cita.interface";

export interface ComisariaInterface {

    idCiudadMunicipio: number;
    comisariaID: number;
    nombComisaria: string;
    direccion: string;
    telefono: number;
    celular: number;
    correo_electronico: string;
    horarioSemanal: string;
    dispAgenda: boolean;
    seleccionado?: boolean;
    disponibilidadCitasList: CitaInterface[];
}
