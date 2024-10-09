import { Routes } from '@angular/router';
import { ConsultaGeneralComponent } from 'src/app/shared/consulta-general/consulta-general.component';
import { InvolucradosPARDComponent } from './involucrados-pard/involucrados-pard.component';

export const trabajadorRoutes: Routes = [
  {
    path: 'involucrados-pard',
    component: InvolucradosPARDComponent,
  },
  { path: 'consulta-general/:id', 
    component: ConsultaGeneralComponent
  }
];
