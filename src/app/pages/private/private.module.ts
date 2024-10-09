import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { MainComponent } from './main/main.component';

import { RecepcionComponent } from './recepcion/recepcion.component';
import { CiudadanoModule } from './ciudadano/ciudadano.module';
import { SolicitudModule } from './solicitud/solicitud.module';
import { AbogadoModule } from './abogado/abogado.module';
import { TrabajadorSocialModule } from './trabajador-social/trabajador-social.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PerfilModule } from './perfil/perfil.module';

@NgModule({
  declarations: [MainComponent, RecepcionComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    CiudadanoModule,
    SolicitudModule,
    SharedModule,
    AbogadoModule,
    TrabajadorSocialModule,
    UsuarioModule,
    PerfilModule
  ],
})
export class PrivateModule {}
