import { Routes } from '@angular/router';
import { AudienciaComponent } from '../../../shared/audiencia/audiencia.component';
import { GestionRemisionComponent } from './gestion-remision/gestion-remision.component';
import { GenerarRemisionComponent } from './gestion-remision/generar-remision/generar-remision.component';

import { HMedidasProteccionComponent } from './h-medidas-proteccion/h-medidas-proteccion.component';
import { ImprimirFirmarCargarComponent } from './imprimir-firmar-cargar/imprimir-firmar-cargar.component';
import { NotificacionesImplicadosComponent } from './notificaciones-implicados/notificaciones-implicados.component';
import { GenerarAutoComponent } from 'src/app/shared/components/auto/generar-auto.component';
import { DecisionJuezComponent } from './components/decision-juez/decision-juez.component';
import { GenerarSeguimientoComponent } from 'src/app/shared/seguimiento/ejecutar-seguimiento/generar-seguimiento/generar-seguimiento.component';
import { EjecutarSeguimientoComponent } from 'src/app/shared/seguimiento/ejecutar-seguimiento/ejecutar-seguimiento.component';
import { DecisionSeguimientoComponent } from 'src/app/shared/seguimiento/decision-seguimiento/decision-seguimiento.component';
import { RecepcionGenerarCargarComponent } from 'src/app/shared/components/recepcion-generar-cargar/recepcion-generar-cargar.component';
import { ContenedorPardComponent } from './components/caso-pard/contenedor-pard.component';
import { ConsultaGeneralComponent } from 'src/app/shared/consulta-general/consulta-general.component';
import { CompetenciaPardComponent } from './components/competencia-pard/competencia-pard.component';
import { SeguimientoPardComponent } from 'src/app/shared/seguimiento-pard/seguimiento-pard.component';

export const abogadoRoutes: Routes = [
  { path: 'agendar-audiencia/:id', component: AudienciaComponent },
  { path: 'historico-medidas/:id', component: HMedidasProteccionComponent },
  { path: 'generar-auto/:id', component: GenerarAutoComponent },
  { path: 'gestion-remision/:id', component: GestionRemisionComponent },
  { path: 'generar-remision/:id', component: GenerarRemisionComponent },
  { path: 'firmar-cargar/:id', component: ImprimirFirmarCargarComponent },
  {
    path: 'notificaciones-implicados/:id',
    component: NotificacionesImplicadosComponent,
  },
  { path: 'decision-juez/:id', component: DecisionJuezComponent },
  {
    path: 'incumplimiento-medidas/:id',
    component: RecepcionGenerarCargarComponent,
  },
  { path: 'generar-seguimiento/:id', component: GenerarSeguimientoComponent },
  { path: 'ejecutar-seguimiento/:id', component: EjecutarSeguimientoComponent },
  { path: 'decision-seguimiento/:id', component: DecisionSeguimientoComponent },
  { path: 'seguimiento-pard/:id', component: SeguimientoPardComponent },
  { path: 'diligenciar-auto/:id', component: GenerarAutoComponent },
  { path: 'caso-pard/:id', component: ContenedorPardComponent },
  { path: 'consulta-general/:id', component: ConsultaGeneralComponent },
  { path: 'competencia-pard', component: CompetenciaPardComponent },
  { path: 'diligenciar-auto', component: GenerarAutoComponent },
  { path: 'caso-pard', component: ContenedorPardComponent },
];
