import { createReducer, on } from '@ngrx/store';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';

import * as actions from '../actions/private.actions';

export interface ListaTipoEntidadState {
  tipo_entidad: DominioInterface[];
}

export const ListaTipoEntidadInitialState: ListaTipoEntidadState = {
  tipo_entidad: []
}

const _ListaTipoEntidad = createReducer(
  ListaTipoEntidadInitialState,
  on(
    actions.setListaListaTipoEntidad,
    (state, { tipo_entidad }) => ({ ...state, tipo_entidad: [...tipo_entidad] })
  ),
  on(
    actions.unsetListaTipoEntidad,
    (state) => ({ ...state, tipo_entidad: [] })
  )
)

export function ListaTipoEntidadReducerList(state: any, _actions: any) {
  return _ListaTipoEntidad(state, _actions);
}
