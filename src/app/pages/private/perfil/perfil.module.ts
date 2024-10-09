import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilComponent } from './perfil.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrarPerfilComponent } from './registrar-perfil/registrar-perfil.component';



@NgModule({
  declarations: [PerfilComponent, RegistrarPerfilComponent],
  imports: [
    CommonModule,
    SharedModule

  ],
  exports: [PerfilComponent],
})
export class PerfilModule { }
