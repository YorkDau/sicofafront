import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudComponent } from './solicitud.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { InvolucradosComponent } from './involucrados/involucrados.component';
import { ModalRemisionComponent } from './modal-remision/modal-remision.component';
import { ModalVicAgrComponent } from './modal-vic-agr/modal-vic-agr.component';




@NgModule({
  declarations: [
    SolicitudComponent,
    PreguntasComponent,
    InvolucradosComponent,
    ModalRemisionComponent,
    ModalVicAgrComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SolicitudModule { }
