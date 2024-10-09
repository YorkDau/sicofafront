import { createReducer, on } from "@ngrx/store";
import { ComisariaInterface } from "src/app/pages/public/interfaces/comisaria.interface";
import * as actions from '../actions/public.actions'

export interface ComisariaState {
    comisaria: ComisariaInterface | null
}

export const ComisariaInitialState: ComisariaState = {
    comisaria: null
}

const _ComisariaReducer = createReducer(
    ComisariaInitialState,
    on(
        actions.setComisaria,
        (state, { comisaria }) => ({ ...state, comisaria: { ...comisaria } })
    ),
    on(
        actions.unsetComisaria,
        (state) => ({ ...state, comisaria: null })
    )
);

export function ComisariaReducer(state: any, _actions: any) {
    return _ComisariaReducer(state, _actions);
}
