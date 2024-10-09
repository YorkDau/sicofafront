import { createReducer, on } from "@ngrx/store";
import { ComisariaInterface } from "src/app/pages/public/interfaces/comisaria.interface";
import * as actions from '../actions/public.actions'

export interface ComisariaListState {
    comisaria: ComisariaInterface[];
    item: string;
}

export const ComisariaListInitialState: ComisariaListState = {
    comisaria: [],
    item: ''
}

const _ComisariaReducerList = createReducer(
    ComisariaListInitialState,
    on(
        actions.setComisariaList,
        (state, { comisaria, item }) => ({ ...state, comisaria: [...comisaria], item })
    ),
    on(
        actions.unsetComisariaList,
        (state) => ({ ...state, comisaria: [], item: '' })
    )
);

export function ComisariaReducerList(state: any, _actions: any) {
    return _ComisariaReducerList(state, _actions);
}
