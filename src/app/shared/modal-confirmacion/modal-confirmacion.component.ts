import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent {

  constructor(private matDialogRef: MatDialogRef<ModalConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string, contenidoMensaje?: string, image?: string, botonAceptar?: string, botonCancelar?: string }) { }


  /**
  * @description confirmacion de modal
  */
  confirmar() {
    this.matDialogRef.close(true);
  }

  /**
  * @description cierra modal
  */
  cerrarModal() {
    this.matDialogRef.close();
  }

}
