import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajadorSocialComponent } from './trabajador-social.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrabajadorSocialRoutingModule } from './trabajador-social.routing.module';
import { InvolucradosPARDComponent } from './involucrados-pard/involucrados-pard.component';
import { RegistroInvolucradosPardComponent } from './registro-involucrados-pard/registro-involucrados-pard.component';
import { PresuntoInvolucradoComponent } from './presunto-involucrado/presunto-involucrado.component';
import { DerechosPrimeroComponent } from './derechos-primero/derechos-primero.component';
import { DerechosSegundoComponent } from './derechos-segundo/derechos-segundo.component';
import { VerificacionDerechosComponent } from './report/components/acta/verificacion-derechos/verificacion-derechos.component';

@NgModule({
  declarations: [
    TrabajadorSocialComponent,
    InvolucradosPARDComponent,
    RegistroInvolucradosPardComponent,
    PresuntoInvolucradoComponent,
    DerechosPrimeroComponent,
    DerechosSegundoComponent,
    VerificacionDerechosComponent,
  ],
  imports: [CommonModule, TrabajadorSocialRoutingModule, SharedModule],
})
export class TrabajadorSocialModule { }
