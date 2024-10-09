import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComisariaComponent } from './comisaria/comisaria.component';
import { ListadoComisariasComponent } from './comisaria/listado-comisarias/listado-comisarias.component';
import { ListadoComisariosComponent } from './comisaria/listado-comisarios/listado-comisarios.component';

@NgModule({
  declarations: [ComisariaComponent, ListadoComisariasComponent, ListadoComisariosComponent],
  imports: [CommonModule, AdministradorRoutingModule, SharedModule],
})
export class AdministradorModule {}
