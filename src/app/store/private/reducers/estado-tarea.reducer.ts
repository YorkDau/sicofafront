import { createReducer, on } from "@ngrx/store";
import { DominioInterface } from "src/app/interfaces/dominio.interface";

import * as actions from '../actions/private.actions'

export interface ListaEstadoTareaState {
    tarea: DominioInterface[];
}

export const ListaEstadoTareaInitialState: ListaEstadoTareaState = {
    tarea: []
}

const _ListaTareaEstadoReducer = createReducer(
    ListaEstadoTareaInitialState,
    on(
        actions.setListaEstadoTarea,
        (state, { tarea }) => ({ ...state, tarea: [...tarea] })
    )
);

export function ListaTareaEstadoReducerList(state: any, _actions: any) {
    return _ListaTareaEstadoReducer(state, _actions);
}
