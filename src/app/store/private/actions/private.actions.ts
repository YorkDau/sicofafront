import { createAction, props } from '@ngrx/store';
import { DominioInterface } from '../../../interfaces/dominio.interface';
import * as interfaces from 'src/app/pages/private/interfaces/ciudadano.interface';

export const unsetListaGenero = createAction('[Género] unsetListaGenero');
export const setListaGenero = createAction(
  '[Género] setListaGenero',
  props<{ genero: DominioInterface[] }>()
);

export const unsetListaTipoDocumento = createAction(
  '[Tipo Documento] unsetListaTipoDocumento'
);
export const setListaTipoDocumento = createAction(
  '[Tipo Documento] setListaTipoDocumento',
  props<{ tipo_documento: DominioInterface[] }>()
);

export const setListaEstadoTarea = createAction(
  '[Estado Tarea] setListaEstadoTarea',
  props<{ tarea: DominioInterface[] }>()
);

export const setDepartamento = createAction(
  '[Departamento] setDepartamento',
  props<{ departamento: interfaces.DepartamentoInterface[] }>()
);

export const unsetListaTipoEntidad = createAction(
  '[Tipo Entidad] unsetListaTipoEntidad'
);
export const setListaListaTipoEntidad = createAction(
  '[Tipo Entidad] setListaListaTipoEntidad',
  props<{ tipo_entidad: DominioInterface[] }>()
);
