import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { SolicitudService } from '../services/solicitud.service';

export interface Involucrado {
  primer_nombre: string;
  segundo_nombre: string;
  numero_documento: string;
  primer_apellido: string;
  segundo_apellido: string;
}
@Component({
  selector: 'app-modal-vic-agr',
  templateUrl: './modal-vic-agr.component.html',
  styleUrls: ['./modal-vic-agr.component.scss'],
})
export class ModalVicAgrComponent implements OnInit {
  public formVicAg!: FormGroup;
  public formInvolucrados!: FormGroup;
  public listaAgresores: Involucrado[] = [];
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;

  constructor(
    private matDialogRef: MatDialogRef<ModalVicAgrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { victimas: any; agresores: any },
    private solicitudService: SolicitudService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.listaAgresores = this.data.agresores.sections;
  }

  ngOnInit(): void {
    this.formVicAg = this.fb.group({
      agresor: ['', Validators.required],
    });

    const idC = +sessionStorage.getItem('idC')! || 6;
    this.formInvolucrados = this.fb.group({
      id: idC,
      involucrados: ['', Validators.required],
    });
  }

  /**
   * @description cierra modal
   */
  cerrarModal() {
    this.matDialogRef.close();
  }

  /**
   * @description valida que sea correcto el form para llamar servicio de involucrados
   */
  registrarInvolucrado() {
    if (this.formVicAg.valid) {
      this.actualizarAgresorPrincipal();
      const merge = this.retornarRegistrosInsertar();
      this.formInvolucrados.controls['involucrados'].setValue(merge);

      this.solicitudService
        .registrarInvolucrados(this.formInvolucrados.value)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              Modales.modalExito(
                Mensajes.MENSAJE_EXITO_SOL,
                'assets/images/check.svg',
                this.dialog
              );
              sessionStorage.removeItem('idC');
              this.cerrarModal();
              this.router.navigate(['/ciudadano']);
            }
          },
          error: () => {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              'assets/images/exclamacion.svg'
            );
          },
        });
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description retorna los datos a registrar
   */
  retornarRegistrosInsertar() {
    let resultado: any[] = [];

    this.data.victimas.sections.forEach((e: any) => {
      if (e.principal) {
        resultado = this.data.agresores.sections;
      } else {
        resultado = this.data.victimas.sections.concat(
          this.data.agresores.sections
        );
      }
    });

    return resultado;
  }

  /**
   * @description actualiza el agresor seleccinado al principal
   */
  actualizarAgresorPrincipal() {
    const { agresor } = this.formVicAg.value;

    this.data.agresores.sections.forEach((a: any) => {
      if (a.numero_documento === agresor) {
        a.principal = true;
      }
    });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.formVicAg.controls[campo]) {
      return this.formVicAg.controls[campo].hasError('required');
    } else {
      return false;
    }
  }
}
