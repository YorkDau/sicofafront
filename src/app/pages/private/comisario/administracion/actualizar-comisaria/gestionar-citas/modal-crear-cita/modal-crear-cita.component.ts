import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { Modales } from '../../../../../../../shared/modals';
import { GestionCitasService } from '../../../services/gestion-citas.service';

@Component({
  selector: 'app-modal-crear-cita',
  templateUrl: './modal-crear-cita.component.html',
  styleUrls: ['./modal-crear-cita.component.scss'],
})
export class ModalCrearCitaComponent implements OnInit {
  public myForm = new FormGroup({
    fechaCita: new FormControl('', [Validators.required]),
  });
  public minDate: Date = new Date();
  public maxDate: Date = new Date(
    new Date().setDate(new Date().getDate() + 365)
  );
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;

  constructor(
    private matDialogRef: MatDialogRef<ModalCrearCitaComponent>,
    private gestionCitasService: GestionCitasService,
    private modales: Modales
  ) {}

  ngOnInit(): void {}

  /**
   * @description valida el campo requerido
   */
  isRequired(): boolean {
    return this.myForm.controls['fechaCita'].hasError('required');
  }

  public crearCita() {
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      this.mostrarValidaciones = false;
      let body = {
        fechaCita: this.myForm.get('fechaCita')?.value,
        horaCita: this.myForm.get('fechaCita')?.value,
      };
      this.gestionCitasService.getCrearCita(body).subscribe({
        next: (result) => {
          if (result && result.statusCode == CodigosRespuesta.OK) {
            this.cerrarModal(true);
            this.modales.modalExito('Cita creada exitosamente');
          } else if(result && result.statusCode == CodigosRespuesta.Bad) {
            this.modales.modalExito(result.message);
          }
        },
        error: (err) => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        },
      });
    }
  }

  /**
   * @description cierra el modal
   */
  public cerrarModal(result: boolean) {
    this.matDialogRef.close(result);
  }
}
