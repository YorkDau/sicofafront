export interface DecisionJuezInterface {
  nombrePrueba: string;
  idAnexo: number;
  idPrueba: number;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}

export interface MedidasJuezInterface {
  idMedida: number;
  nombreMedida: string;
  estadoMedida: string;
  tipoMedida: number;
  excluir: string;
}

export interface TareasApelacionInterface {
  idFlujo: number;
  nombreTarea: string;
}
