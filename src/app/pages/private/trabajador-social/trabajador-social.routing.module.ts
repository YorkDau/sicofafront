import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { MainRecepcionComponent } from 'src/app/shared/components/inicio-casos/main-recepcion/main-recepcion.component';
import { RecepcionCasosComponent } from 'src/app/shared/components/inicio-casos/recepcion-casos/recepcion-casos.component';
import { RegistroInvolucradosPardComponent } from './registro-involucrados-pard/registro-involucrados-pard.component';
import { TrabajadorSocialComponent } from './trabajador-social.component';
import { trabajadorRoutes } from './trabajador-social.routing';

const routes: Routes = [
  {
    path: '',
    component: TrabajadorSocialComponent,
    children: trabajadorRoutes,
  },
  {
    path: 'casos',
    component: MainRecepcionComponent,
    children: [{ path: '', component: RecepcionCasosComponent }],
  },
  {
    path: 'registro-involucrados',
    component: RegistroInvolucradosPardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrabajadorSocialRoutingModule {}
