import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CiudadanoComponent } from './ciudadano.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrarCiudadanoComponent } from './registrar-ciudadano/registrar-ciudadano.component';
import { HistorialCiudadanoComponent } from './historial-ciudadano/historial-ciudadano.component';
import { ModalDetalleSolicitudCiudadanoComponent } from './historial-ciudadano/modal-detalle-solicitud-ciudadano/modal-detalle-solicitud-ciudadano.component';

@NgModule({
  declarations: [
    CiudadanoComponent,
    RegistrarCiudadanoComponent,
    HistorialCiudadanoComponent,
    ModalDetalleSolicitudCiudadanoComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [CiudadanoComponent],
  providers: [DatePipe]
})
export class CiudadanoModule { }
