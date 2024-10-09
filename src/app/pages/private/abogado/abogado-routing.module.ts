import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainRecepcionComponent } from 'src/app/shared/components/inicio-casos/main-recepcion/main-recepcion.component';
import { RecepcionCasosComponent } from 'src/app/shared/components/inicio-casos/recepcion-casos/recepcion-casos.component';
import { AbogadoComponent } from './abogado.component';
import { abogadoRoutes } from './abogado.routing';
import { MedidaProteccionComponent } from './medida-proteccion/medida-proteccion.component';
import { SeguimientoComponent } from 'src/app/shared/seguimiento/seguimiento.component';

const routes: Routes = [
  { path: '', component: AbogadoComponent, children: abogadoRoutes },
  {
    path: 'casos',
    component: MainRecepcionComponent,
    children: [{ path: '', component: RecepcionCasosComponent }],
  },
  {
    path: 'seguimientos',
    component: SeguimientoComponent,
  },
  { path: 'medida-proteccion', component: MedidaProteccionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbogadoRoutingModule {}
