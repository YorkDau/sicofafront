export interface TipoDeDominiosInterface {
  nombreDominio: string;
}

export interface DominiosInterface {
  id: number;
  nombre: string;
}

export interface detalleDominioInterface {
  id: number;
  nombreDominio: string;
  codigo: string;
  tipoLista: string;
  activo: boolean;
}

export interface agregarDominioInterface {
  tipoDominio: string;
  nombreDominio: string;
  codigo: string;
  tipoLista: string;
}
export interface modificarDominioInterface {
  id: number;
  nombreDominio: string;
  codigo: string;
  tipoLista: string;
  activo: boolean;
}
