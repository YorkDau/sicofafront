import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecisionSeguimientoComponent } from 'src/app/shared/seguimiento/decision-seguimiento/decision-seguimiento.component';
import { EjecutarSeguimientoComponent } from 'src/app/shared/seguimiento/ejecutar-seguimiento/ejecutar-seguimiento.component';
import { GenerarSeguimientoComponent } from 'src/app/shared/seguimiento/ejecutar-seguimiento/generar-seguimiento/generar-seguimiento.component';
import { SeguimientoComponent } from 'src/app/shared/seguimiento/seguimiento.component';
import { GenerarAutoComponent } from '../../../shared/components/auto/generar-auto.component';
import { InicioCasosComponent } from '../../../shared/components/inicio-casos/inicio-casos.component';
import { DecisionJuezComponent } from '../abogado/components/decision-juez/decision-juez.component';
import { QuorumComponent } from '../quorum/quorum/quorum.component';
import { ComisarioComponent } from './comisario/comisario.component';
import { GestionDominiosComponent } from './administracion/gestion-dominios/gestion-dominios.component';
import { GrupoDominioComponent } from './administracion/gestion-dominios/grupo-dominio/grupo-dominio.component';
import { GestionUsuariosComponent } from './administracion/gestion-usuarios/gestion-usuarios.component';
import { CrearModifcarUsuariosComponent } from './administracion/gestion-usuarios/crear-modifcar-usuarios/crear-modifcar-usuarios.component';
import { ActualizarComisariaComponent } from './administracion/actualizar-comisaria/actualizar-comisaria.component';
import { ConsultaGeneralComponent } from 'src/app/shared/consulta-general/consulta-general.component';
import { SeguimientoPardComponent } from 'src/app/shared/seguimiento-pard/seguimiento-pard.component';

const routes: Routes = [
  { path: 'casos', component: InicioCasosComponent },
  { path: 'gestion-dominios', component: GestionDominiosComponent},
  { path: 'grupo-dominio/:tipoDominio', component: GrupoDominioComponent},
  { path: 'gestion-usuarios', component: GestionUsuariosComponent},
  { path: 'modificar-usuario/:idUsuarioSistema', component: CrearModifcarUsuariosComponent},
  { path: 'crear-usuario', component: CrearModifcarUsuariosComponent},
  { path: 'actualizar-comisaria', component: ActualizarComisariaComponent},
  {
    path: '',
    component: ComisarioComponent,
    children: [
      { path: 'quorum/:id', component: QuorumComponent },
      { path: 'decision-juez/id', component: DecisionJuezComponent },
      { path: 'revisar-auto/:id', component: GenerarAutoComponent },
      { path: 'seguimientos', component: SeguimientoComponent },
      { path: 'crear-fallo/:id', component: GenerarAutoComponent },
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
      { 
        path: 'seguimiento-pard/:id', 
        component: SeguimientoPardComponent 
      },
      { path: 'consulta-general/:id', 
        component: ConsultaGeneralComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComisarioRoutingModule {}
