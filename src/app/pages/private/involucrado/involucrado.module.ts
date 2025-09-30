import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { InvolucradoComponent } from "./involucrado.component";
import { HistorialInvolucradoComponent } from "./historial-involucrado/historial-involucrado.component";
import { ModalDetalleSolicitudCiudadanoComponent } from "./historial-involucrado/modal-detalle-solicitud-ciudadano/modal-detalle-solicitud-ciudadano.component";

@NgModule({
  declarations: [
    InvolucradoComponent, 
    HistorialInvolucradoComponent, 
    ModalDetalleSolicitudCiudadanoComponent
  ],
  imports: [CommonModule, SharedModule],
  providers: [DatePipe],
  exports: [InvolucradoComponent],
})
export class InvolucradoModule { }
