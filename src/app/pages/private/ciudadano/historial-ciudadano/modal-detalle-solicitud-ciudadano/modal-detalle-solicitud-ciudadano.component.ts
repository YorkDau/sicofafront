import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Mensajes } from '../../../../../constants';
import { SharedFunctions } from '../../../../../shared/functions';
import { Modales } from '../../../../../shared/modals';
import { CiudadanoDetalleInterface } from '../../../interfaces/ciudadano.interface';
import { SolicitudServicioDetalleInterface } from '../../../interfaces/historial.interface';
import { CiudadanoService } from '../../services/ciudadano.service';

@Component({
  selector: 'app-modal-detalle-solicitud-ciudadano',
  templateUrl: './modal-detalle-solicitud-ciudadano.component.html',
  styleUrls: ['./modal-detalle-solicitud-ciudadano.component.scss']
})
export class ModalDetalleSolicitudCiudadanoComponent {


  public detalleSolicitud!: SolicitudServicioDetalleInterface

  constructor(private matDialogRef: MatDialogRef<ModalDetalleSolicitudCiudadanoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_solicitud: number, ciudadano: CiudadanoDetalleInterface },
    private ciudadanoService: CiudadanoService,
    private modales: Modales,
  ) {

    if (!this.data.id_solicitud) { //Error hipotético
      ("Error de enrutamiento: No se obtuvo la identificacion del ciudadano")
      this.cerrarModal()
      return
    }
    if (!this.data.ciudadano) { //Error hipotético
      ("Error de enrutamiento: No se obtuvo la información del ciudadano")
      this.cerrarModal()
      return
    }
    this.getSolicitudDetalle()
  }

  /**
  * @description cierra modal
  */
  cerrarModal() {
    this.matDialogRef.close();
  }

  /**
   * @description obtiene el detalle de la solicitud a partir de su id.
   * @param id_solicitud id de la solicitud
   */
  public async getSolicitudDetalle() {
    try {
      const result = await lastValueFrom(this.ciudadanoService.getSolicitudDetalle(this.data.id_solicitud));
      if (!result) {
        this.modales.modalInformacion("No se encontró la información de la solicitud.")
        this.cerrarModal()
        return
      }
      if (result.statusCode != 200) {
        this.modales.modalInformacion(result.message)
        this.cerrarModal()
        return
      }
      if (!result.data) {
        this.modales.modalInformacion("Ocurrió un error al consultar los datos de la solicitud.")
        this.cerrarModal()
        return
      }
      this.detalleSolicitud = result.data
    } catch (error: any) {
      SharedFunctions.getErrorMessage(error)
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G)
      this.cerrarModal()
    }
  }


  printNombreCiudadano() {
    if (this.data.ciudadano) {
      let nombre_completo = ""
      nombre_completo += this.data.ciudadano.nombre_ciudadano ? this.data.ciudadano.nombre_ciudadano + " " : ""
      nombre_completo += this.data.ciudadano.primer_apellido ? this.data.ciudadano.primer_apellido + " " : ""
      nombre_completo += this.data.ciudadano.segundo_apellido ? this.data.ciudadano.segundo_apellido : ""
      return nombre_completo
    }

    return "N/A"
  }
}
