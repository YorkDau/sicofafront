import { createReducer, on } from '@ngrx/store';
import { CitaInterface } from 'src/app/pages/public/interfaces/cita.interface';
import * as actions from '../actions/public.actions'

export interface HorarioState {
    horario: CitaInterface | null;
    idhoraCita: number;
}

export const HorarioInitialState: HorarioState = {
    horario: null,
    idhoraCita: 0
}

const _HorarioReducer = createReducer(
    HorarioInitialState,
    on(
        actions.setHorario,
        (state, { horario, idhoraCita }) => ({ ...state, horario: { ...horario }, idhoraCita })
    ),
    on(
        actions.unsetHorario,
        (state) => ({ ...state, horario: null, idhoraCita: 0 })
    )
);

export function HorarioReducer(state: any, _actions: any) {
    return _HorarioReducer(state, _actions);
}
