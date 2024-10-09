import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-exito',
  templateUrl: './modal-exito.component.html',
  styleUrls: ['./modal-exito.component.scss']
})
export class ModalExitoComponent {

  constructor(private matDialogRef: MatDialogRef<ModalExitoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string, image: string }) { }


  /**
  * @description cierra modal
  */
  cerrarModal() {
    this.matDialogRef.close();
  }
  
}
