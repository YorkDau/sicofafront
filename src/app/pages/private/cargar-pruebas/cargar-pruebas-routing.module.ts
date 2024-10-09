import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargarPruebasComponent } from './cargar-pruebas/cargar-pruebas.component';

const routes: Routes = [
{path:"",component:CargarPruebasComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargarPruebasRoutingModule { }
