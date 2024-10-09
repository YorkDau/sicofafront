export interface AutoInterface {
  afectadoInvolucrado: number;
  estructura: string;
  idDocumento: number;
  idSeccionDocumento: number;
  idSeccionPadre: number;
  nombreDocumento: string;
  nombreSeccion: string;
  orden: number;
  padre: number;
  pruebas: number;
  seccionMedidas: MedidasInterface[];
  seccionPruebas: string;
  seccionesHijas: AutoInterface[];
  textoInvolucrado: string;
  tipoMedida: number;
  check: boolean;
}

export interface MedidasInterface {
  activo: number;
  check: boolean;
  idMedida: number;
  nombre: string;
  texto: string;
  involucrados: InvolucradosAutoInterface[];
  idSeccionPadre: number;
}

export interface InvolucradosAutoInterface {
  apellidos: string;
  check: boolean;
  id: number;
  nombres: string;
  relacion: string;
}

export interface TreeInterface {
  estado: boolean;
  idSolPSeccion: number;
  nombreSeccion: string;
  leaf: TreeInterface[] | null;
  seccion: SeccionesInterface;
  nombrePlantilla: string;
  observacion: string | null;
}

export interface SeccionesInterface {
  estadoSeccion: boolean;
  hayInvolucrado: boolean;
  idSeccionPlantilla: number;
  idSolPSeccion: number;
  idSolicitudServicio: number;
  nombreSeccion: string;
  orden: number;
  textoSeccion: string | null;
  involucrados: InvolucradosInterface[];
}

export interface InvolucradosInterface {
  estado: boolean;
  idInvolucrado: number;
  idSolPSeccion: number;
  nombresInvolucrado: string;
}
