import { createReducer, on } from "@ngrx/store";
import * as interfaces from 'src/app/pages/private/interfaces/ciudadano.interface';

import * as actions from '../actions/private.actions'

export interface DepartamentoState {
    departamento: interfaces.DepartamentoInterface[]
}

export const DepartamentoInitialState: DepartamentoState = {
    departamento: []
}

const _DepartamentoReducer = createReducer(
    DepartamentoInitialState,
    on(
        actions.setDepartamento,
        (state, { departamento }) => ({ ...state, departamento: [...departamento] })
    )
);

export function DepartamentoReducer(state: any, _actions: any) {
    return _DepartamentoReducer(state, _actions);
}
