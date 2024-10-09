import { AutoInterface } from './auto.interface';

export interface GuardarAuto {
  cabecera: CabeceraAuto;
  cuerpo: AutoInterface[];
}

export interface CabeceraAuto {
  idDocServ: number;
  idSolicitudServicio: number;
  idDocumento: number;
  idComisaria: number;
  nombreDocumento: string;
  comentarios: string;
  aprobacionComisario: boolean;
  idTarea: number;
}
