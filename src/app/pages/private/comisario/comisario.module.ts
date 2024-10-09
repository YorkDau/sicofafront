import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComisarioRoutingModule } from './comisario-routing.module';
import { ComisarioComponent } from './comisario/comisario.component';
import { SharedModule } from '../../../shared/shared.module';
import { GestionDominiosComponent } from './administracion/gestion-dominios/gestion-dominios.component';
import { GrupoDominioComponent } from './administracion/gestion-dominios/grupo-dominio/grupo-dominio.component';
import { ModalDominioComponent } from './administracion/gestion-dominios/modal-dominio/modal-dominio.component';
import { GestionUsuariosComponent } from './administracion/gestion-usuarios/gestion-usuarios.component';
import { CrearModifcarUsuariosComponent } from './administracion/gestion-usuarios/crear-modifcar-usuarios/crear-modifcar-usuarios.component';
import { ActualizarComisariaComponent } from './administracion/actualizar-comisaria/actualizar-comisaria.component';
import { ModalCrearCitaComponent } from './administracion/actualizar-comisaria/gestionar-citas/modal-crear-cita/modal-crear-cita.component';
import { GestionarCitasComponent } from './administracion/actualizar-comisaria/gestionar-citas/gestionar-citas.component';

@NgModule({
  declarations: [
    ComisarioComponent,
    GestionDominiosComponent,
    GrupoDominioComponent,
    ModalDominioComponent,
    GestionUsuariosComponent,
    CrearModifcarUsuariosComponent,
    ActualizarComisariaComponent,
    ModalCrearCitaComponent,
    GestionarCitasComponent,
  ],
  imports: [CommonModule, ComisarioRoutingModule, SharedModule],
})
export class ComisarioModule {}
