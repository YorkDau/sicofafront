import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PsicologiaComponent } from './psicologia.component';
import { PsicologiaRoutingModule } from './psicologia-routing.module';
import { IdentificacionRiesgoComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-riesgo.component';
import { ValoracionComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-del-riesgo/valoracion/valoracion.component';
import { TiposViolenciaComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-del-riesgo/tipos-violencia/tipos-violencia.component';
import { SugerenciaApoyoExternoComponent } from './resumen-solicitud/identificacion-riesgo/sugerencia-apoyo-externo/sugerencia-apoyo-externo.component';
import { PercepcionVictimaComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-del-riesgo/percepcion-victima/percepcion-victima.component';
import { CircunstanciasAgravantesComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-del-riesgo/circunstancias-agravantes/circunstancias-agravantes.component';
import { IdentificacionDelRiesgoComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-del-riesgo/identificacion-del-riesgo.component';
import { DatosInvolucradosComponent } from './resumen-solicitud/datos-involucrados/datos-involucrados.component';
import { DescripcionHechosComponent } from './resumen-solicitud/identificacion-riesgo/identificacion-del-riesgo/descripcion-hechos/descripcion-hechos.component';
import { EntrevistaPsicologicaEmocionalComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/entrevista-psicologica-emocional.component';
import { DatosIdentificacionComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/datos-identificacion/datos-identificacion.component';
import { MotivoComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/motivo/motivo.component';
import { AntecedentesComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/antecedentes/antecedentes.component';
import { ProcedimientoMetodologiaComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/procedimiento-metodologia/procedimiento-metodologia.component';
import { RelatoHechosComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/relato-hechos/relato-hechos.component';
import { RedesApoyoComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/redes-apoyo/redes-apoyo.component';
import { ConclusionRecomendacionesComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/conclusion-recomendaciones/conclusion-recomendaciones.component';
import { HijosInvolucradosComponent } from './resumen-solicitud/datos-involucrados/hijos-involucrados/hijos-involucrados.component';
import { PercepcionVictimaEntrevistaComponent } from './resumen-solicitud/identificacion-riesgo/entrevista-psicologica-emocional/percepcion-victima/percepcion-victima-entrevista.component';

@NgModule({
  declarations: [
    PsicologiaComponent,
    IdentificacionRiesgoComponent,
    ValoracionComponent,
    TiposViolenciaComponent,
    SugerenciaApoyoExternoComponent,
    PercepcionVictimaComponent,
    CircunstanciasAgravantesComponent,
    IdentificacionDelRiesgoComponent,
    DatosInvolucradosComponent,
    DescripcionHechosComponent,
    EntrevistaPsicologicaEmocionalComponent,
    DatosIdentificacionComponent,
    MotivoComponent,
    AntecedentesComponent,
    ProcedimientoMetodologiaComponent,
    RelatoHechosComponent,
    RedesApoyoComponent,
    ConclusionRecomendacionesComponent,
    HijosInvolucradosComponent,
    PercepcionVictimaEntrevistaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PsicologiaRoutingModule,

  ],
  exports: [PsicologiaComponent],
})
export class PsicologiaModule { }
