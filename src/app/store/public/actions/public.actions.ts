import { createAction, props } from "@ngrx/store";
import { CitaInterface } from "src/app/pages/public/interfaces/cita.interface";
import { ComisariaInterface } from "src/app/pages/public/interfaces/comisaria.interface";
import { TipoAtencion } from "src/app/pages/public/interfaces/tipo-atencion.interface";


export const unsetComisariaList = createAction('[Comisaria] unsetComisariaList');
export const setComisariaList = createAction(
    '[Comisaria] setComisariaList',
    props<{ comisaria: ComisariaInterface[], item: string }>()
);

export const unsetHorario = createAction('[Horario] unsetHorario');
export const setHorario = createAction(
    '[Horario] setHorario',
    props<{ horario: CitaInterface, idhoraCita: number }>()
);

export const unsetComisaria = createAction('[Comisaria] unsetComisaria');
export const setComisaria = createAction(
    '[Comisaria] setComisaria',
    props<{ comisaria: ComisariaInterface }>()
);

export const unsetTiposAtencionList = createAction('[Tipos Atencion unsetTiposAtencionList]');
export const setTiposAtencionList = createAction(
    '[Tipos Atencion] setTiposAtencionList',
    props<{ tipoAtencion: TipoAtencion[] }>()
);
