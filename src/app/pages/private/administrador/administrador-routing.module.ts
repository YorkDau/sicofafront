import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComisariaComponent } from './comisaria/comisaria.component';
import { ListadoComisariasComponent } from './comisaria/listado-comisarias/listado-comisarias.component';

const routes: Routes = [
  { path: 'listado-comisarias', component: ListadoComisariasComponent },
  { path: 'comisaria', component: ComisariaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
