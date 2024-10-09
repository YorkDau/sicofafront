import { createReducer, on } from "@ngrx/store";
import { DominioInterface } from "src/app/interfaces/dominio.interface";

import * as actions from '../actions/private.actions'

export interface ListaGeneroState {
    genero: DominioInterface[]
}

export const ListaGeneroInitialState: ListaGeneroState = {
    genero: []
}

const _ListaGeneroReducer = createReducer(
    ListaGeneroInitialState,
    on(
        actions.setListaGenero,
        (state, { genero }) => ({ ...state, genero: [...genero] })
    ),
    on(
        actions.unsetListaGenero,
        (state) => ({ ...state, genero: [] })
    )
);

export function ListaGeneroReducerList(state: any, _actions: any) {
    return _ListaGeneroReducer(state, _actions);
}
