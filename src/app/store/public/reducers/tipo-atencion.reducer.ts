import { createReducer, on } from "@ngrx/store";
import { TipoAtencion } from "src/app/pages/public/interfaces/tipo-atencion.interface";
import * as actions from '../actions/public.actions'

export interface TipoAtencionListState {
    tipoAtencion: TipoAtencion[];
}

export const TipoAtencionListInitialState: TipoAtencionListState = {
    tipoAtencion: []
}

const _TipoAtencionReducerList = createReducer(
    TipoAtencionListInitialState,
    on(
        actions.setTiposAtencionList,
        (state, { tipoAtencion }) => ({ ...state, tipoAtencion: [...tipoAtencion] })
    ),
    on(
        actions.unsetTiposAtencionList,
        (state) => ({ ...state, tipoAtencion: [] })
    )
);

export function TipoAtencionReducerList(state: any, _actions: any) {
    return _TipoAtencionReducerList(state, _actions);
}
