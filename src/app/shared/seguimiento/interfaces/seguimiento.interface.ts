import { CargarArchivoInterface } from '../../../interfaces/shared.interfaces';

export interface TablaSeguimiento {
  tipoFormato: string;
  fecha: string;
  estado: string;
}

export interface TiposFormatoSeguimiento {
  id: string;
  nombre: string;
}

export interface DataSeguimiento {
  nombreVictima: string;
  tipoDocumentoVictima: string;
  numeroDocumentoVictima: string;
  lugarExpedicionVictima: string;
  numeroTelVictima: string;
  correoVictima: string;
  direccionVictima: string;
  nombreComisario: string;
  ciudadRemision: string;
  estado: string;
  edadVictima: number;
}

export interface CargarArchivoProrroga extends CargarArchivoInterface {
  idComisaria: number;
  idUsuario: number;
}
