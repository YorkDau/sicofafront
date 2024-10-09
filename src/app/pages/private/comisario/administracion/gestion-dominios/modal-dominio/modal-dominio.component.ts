import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { agregarDominioInterface, detalleDominioInterface, modificarDominioInterface } from '../../interfaces/dominios.interface';
import { GestionDominioService } from '../../services/gestion-dominio.service';

@Component({
  selector: 'app-modal-dominio',
  templateUrl: './modal-dominio.component.html',
  styleUrls: ['./modal-dominio.component.scss']
})
export class ModalDominioComponent implements OnInit {

  public formCrear!: FormGroup;
  public formModificar!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public detallesDominio: detalleDominioInterface = {
    activo: true,
    codigo: '',
    id: 0,
    nombreDominio: '',
    tipoLista: '',
  };

  constructor(
    private fb: FormBuilder,
    private modales: Modales,
    private gestionDominioService: GestionDominioService,
    private _dialog: MatDialog,
    private matDialogRef: MatDialogRef<ModalDominioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoDominio: string, flag: boolean, idDominio: number }
  ) { }

  ngOnInit(): void {
    if (this.data.flag) {
      this.cargarFormCrear();
    } else {
      this.cargarFormModificar();
      this.cargarDetallesDominio();
    }
  }

  /**
   * @description carga el form para crear un nuevo dominio
   */
  private cargarFormCrear() {
    this.formCrear = this.fb.group({
      nombreDominio: ['', [Validators.required]],
      codigoDominio: ['', [Validators.required]]
    });
  }
  /**
   * @description carga el fom para modificar un dominio
   */
  private cargarFormModificar() {
    this.formModificar = this.fb.group({
      nombreDominio: ['', [Validators.required]],
      codigoDominio: ['', [Validators.required]],
      estado: [, [Validators.required]]
    });
  }
  /**
  * @decription trae los detalles del dominio
  */
  private cargarDetallesDominio() {
    this.gestionDominioService.getDetallesDominio(this.data.idDominio).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.detallesDominio = data.data;
          this.formModificar.controls['nombreDominio'].setValue(this.detallesDominio.nombreDominio);
          this.formModificar.controls['codigoDominio'].setValue(this.detallesDominio.codigo);
          this.formModificar.controls['estado'].setValue(this.detallesDominio.activo);
        } else {
          this.msgError();
        }
      },
      error: () => {
        this.msgError();
      }
    });
  }

  /**
   * @description hace la validacion para los campos del formCrear
   * @param campo 
   * @returns 
   */

  public isRequiredCrear(campo: string): boolean {
    return this.formCrear.controls[campo].hasError('required');
  }
  /**
   * @description hace la validacion para los campos del formModificar
   * @param campo 
   * @returns 
   */
  public isRequiredModificar(campo: string): boolean {
    return this.formModificar.controls[campo].hasError('required');
  }

  /**
   * @description Crea un nuevo dominio
   * @param obj 
   */
  private agregarNuevoDominio(obj: agregarDominioInterface) {
    this.gestionDominioService.postCrearNuevoDominio(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.mensajeConfirmacion('Dominio creado con éxito');
        } else {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        }
      },
      error: () => {
        Modales.modalExito(
          'El código del dominio ya existe',
          ImagenesModal.EXCLAMACION,
          this._dialog
        );
      }
    });
  }

  /**
   * @descrption Modifica un dominio existente
   * @param obj 
   */
  private modificarDominio(obj: modificarDominioInterface) {
    this.gestionDominioService.postModificarDominio(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.mensajeConfirmacion('Información del dominio modificada con éxito');
        } else {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        }
      },
      error: () => {
        Modales.modalExito(
          'El nombre o codigo de dominio ya existe',
          ImagenesModal.EXCLAMACION,
          this._dialog
        );
      }
    });
  }

  public guardar() {
    this.mostrarValidaciones = false;
    if (this.data.flag) {
      if (this.formCrear.invalid) {
        this.mostrarValidaciones = true;
      } else {
        this.agregarNuevoDominio(this.getDataPostDominio);
      }
    } else {
      if (this.formModificar.invalid) {
        this.mostrarValidaciones = true;
      } else {
        this.modificarDominio(this.getDataModificarDominio);
      }
    }
  }

  /**
   * @description cierra el modal
   */
  public cerrarModal() {
    this.matDialogRef.close(false);
  }
  /**
   * @description mensaje de confirmación de creación de seguimiento
   */
  private mensajeConfirmacion(msg: string) {
    this.modales.modalExito(msg).subscribe(() => {
      this.matDialogRef.close(true);
    });
  }

  private get getDataPostDominio(): agregarDominioInterface {

    return {
      tipoDominio: this.data.tipoDominio,
      nombreDominio: this.formCrear.get('nombreDominio')?.value,
      codigo: this.formCrear.get('codigoDominio')?.value,
      tipoLista: 'Lista',
    }
  }

  private get getDataModificarDominio(): modificarDominioInterface {
    return {
      activo: this.formModificar.get('estado')?.value,
      codigo: this.formModificar.get('codigoDominio')?.value,
      id: this.data.idDominio,
      nombreDominio: this.formModificar.get('nombreDominio')?.value,
      tipoLista: 'LISTA'
    }
  }

  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}
