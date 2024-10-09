import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CargarPruebasRoutingModule } from './cargar-pruebas-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CargarPruebasComponent } from './cargar-pruebas/cargar-pruebas.component';

@NgModule({
  declarations: [CargarPruebasComponent],
  imports: [CommonModule, CargarPruebasRoutingModule, SharedModule],
})
export class CargarPruebasModule {}
