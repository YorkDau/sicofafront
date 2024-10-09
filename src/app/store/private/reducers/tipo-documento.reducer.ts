import { createReducer, on } from '@ngrx/store';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';

import * as actios from '../actions/private.actions';

export interface ListaTipoDocumentoState {
    tipo_documento: DominioInterface[];
}

export const ListaTipoDocumentoInitialState: ListaTipoDocumentoState = {
  tipo_documento: []
}

const _ListaTipoDocumento = createReducer(
  ListaTipoDocumentoInitialState,
  on(
    actios.setListaTipoDocumento,
    (state, { tipo_documento }) => ({ ...state, tipo_documento: [...tipo_documento] })
  ),
  on(
    actios.unsetListaTipoDocumento,
    (state) => ({ ...state, tipo_documento: [] })
  )
)

export function ListaTipoDocumentoReducerList(state: any, _actions: any) {
  return _ListaTipoDocumento(state, _actions);
}
