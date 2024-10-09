import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecepcionCasosComponent } from 'src/app/shared/components/inicio-casos/recepcion-casos/recepcion-casos.component';
import { ConsultaGeneralComponent } from 'src/app/shared/consulta-general/consulta-general.component';
import { SeguimientoPardComponent } from 'src/app/shared/seguimiento-pard/seguimiento-pard.component';
import { DecisionSeguimientoComponent } from 'src/app/shared/seguimiento/decision-seguimiento/decision-seguimiento.component';
import { EjecutarSeguimientoComponent } from 'src/app/shared/seguimiento/ejecutar-seguimiento/ejecutar-seguimiento.component';
import { GenerarSeguimientoComponent } from 'src/app/shared/seguimiento/ejecutar-seguimiento/generar-seguimiento/generar-seguimiento.component';
import { SeguimientoComponent } from 'src/app/shared/seguimiento/seguimiento.component';
import { PsicologiaComponent } from './psicologia.component';

import { DatosInvolucradosComponent } from './resumen-solicitud/datos-involucrados/datos-involucrados.component';
import { ConclusionRecomendacionesComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/conclusion-recomendaciones/conclusion-recomendaciones.component';
import { ValoracionComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-del-riesgo/valoracion/valoracion.component';
import { IdentificacionRiesgoComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-riesgo.component';

const routes: Routes = [
  {
    path: '',
    component: PsicologiaComponent,
    children: [
      { path: 'casos', component: RecepcionCasosComponent },
      { path: 'seguimientos', component: SeguimientoComponent },
      { path: '', redirectTo: 'casos' },
      {
        path: 'generar-seguimiento/:id',
        component: GenerarSeguimientoComponent,
      },
      {
        path: 'ejecutar-seguimiento/:id',
        component: EjecutarSeguimientoComponent,
      },
      {
        path: 'decision-seguimiento/:id',
        component: DecisionSeguimientoComponent,
      },
      { path: 'seguimiento-pard/:id', component: SeguimientoPardComponent },
      { path: 'consulta-general/:id', component: ConsultaGeneralComponent },
    ],
  },
  {
    path: 'resumen/:idSolicitud',
    component: DatosInvolucradosComponent,
  },
  {
    path: 'resumen',
    component: DatosInvolucradosComponent,
  },
  {
    path: 'identificacion-riesgo',
    component: IdentificacionRiesgoComponent,
  },
  {
    path: 'identificacion-riesgo/:idSolicitud',
    component: IdentificacionRiesgoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PsicologiaRoutingModule {}
