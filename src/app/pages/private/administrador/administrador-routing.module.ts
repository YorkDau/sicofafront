import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComisariaComponent } from './comisaria/comisaria.component';
import { ListadoComisariasComponent } from './comisaria/listado-comisarias/listado-comisarias.component';
import { CrearModifcarUsuariosComponent } from '../comisario/administracion/gestion-usuarios/crear-modifcar-usuarios/crear-modifcar-usuarios.component';

const routes: Routes = [
  { path: 'listado-comisarias', component: ListadoComisariasComponent },
  { path: 'comisaria', component: ComisariaComponent },
   { path: 'modificar-usuario/:idUsuarioSistema', component: CrearModifcarUsuariosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
