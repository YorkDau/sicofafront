import { ActionReducerMap } from '@ngrx/store';
import * as publicReducers from './public/reducers';
import * as privateReducers from './private/reducers';

export interface AppState {
  comisariaList: publicReducers.ComisariaListState;
  horario: publicReducers.HorarioState;
  comisaria: publicReducers.ComisariaState;
  tipoAtencion: publicReducers.TipoAtencionListState;
  genero: privateReducers.ListaGeneroState;
  tipo_documento: privateReducers.ListaTipoDocumentoState;
  tipo_entidad: privateReducers.ListaTipoEntidadState;
  tarea: privateReducers.ListaEstadoTareaState;
  departamento: privateReducers.DepartamentoState;
}

export const appReducer: ActionReducerMap<AppState> = {
  comisariaList: publicReducers.ComisariaReducerList,
  horario: publicReducers.HorarioReducer,
  comisaria: publicReducers.ComisariaReducer,
  tipoAtencion: publicReducers.TipoAtencionReducerList,
  genero: privateReducers.ListaGeneroReducerList,
  tipo_documento: privateReducers.ListaTipoDocumentoReducerList,
  tipo_entidad: privateReducers.ListaTipoEntidadReducerList,
  tarea: privateReducers.ListaTareaEstadoReducerList,
  departamento: privateReducers.DepartamentoReducer,
};
