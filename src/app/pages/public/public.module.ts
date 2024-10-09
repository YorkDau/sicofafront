import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { PublicRoutingModule } from './public-routing.module';
import { ComisariaComponent } from './comisaria/comisaria.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/app.material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CitaComponent } from './cita/cita.component';
import { HorarioComponent } from './cita/horario/horario.component';
import { UsuarioComponent } from './cita/usuario/usuario.component';

@NgModule({
  declarations: [
    MainComponent,
    ComisariaComponent,
    CitaComponent,
    HorarioComponent,
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AppMaterialModule
  ]
})
export class PublicModule { }
