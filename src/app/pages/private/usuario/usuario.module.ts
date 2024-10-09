import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuarioComponent } from './usuario.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [UsuarioComponent, RegistrarUsuarioComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [UsuarioComponent],
  providers: [DatePipe]
})
export class UsuarioModule { }
