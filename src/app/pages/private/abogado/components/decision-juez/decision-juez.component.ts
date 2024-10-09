import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';

import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import {
  MedidasJuezInterface,
  TareasApelacionInterface,
} from '../../interfaces/decision-juez';
import { AbogadoService } from '../../services/abogado.service';
import { ModalCargarDocumentoComponent } from '../modal-cargar-documento/modal-cargar-documento.component';
import { ModalMedidasAutoComponent } from '../modal-medidas-auto/modal-medidas-auto.component';
import { ModalReporteJuezComponent } from '../modal-reporte-juez/modal-reporte-juez.component';

@Component({
  selector: 'app-decision-juez',
  templateUrl: './decision-juez.component.html',
})
export class DecisionJuezComponent implements OnInit {
  public decisionForm!: FormGroup;
  public mostrarNulidad: boolean = false;
  public mostrarOpcionesNulidad: boolean = false;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public listaTareaApelacion: TareasApelacionInterface[] = [];

  private listaMedidas: MedidasJuezInterface[] = [];
  private objSol!: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private abogadoService: AbogadoService
  ) {}

  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.cargarForm();
    this.consultarTareasApelacion();
    this.obtenerApelacion();
  }

  /**
   * @description carga formulario
   */
  private cargarForm() {
    this.decisionForm = this.fb.group({
      idSolicitudServicio: 0,
      idTarea: 0,
      idApelacion: 0,
      idFlujoRetorno: 0,
      aceptaRecurso: false,
      declaraNulidad: false,
      lstMedidas: [],
    });
    this.cambiosForm();
  }

  /**
   * @description  escucha cambios para mostrar nulidad
   */
  private cambiosForm() {
    this.decisionForm.controls['aceptaRecurso'].valueChanges.subscribe(
      (valor: boolean) => {
        this.mostrarNulidad = valor;
        if (!valor) {
          this.decisionForm.controls['idFlujoRetorno'].clearValidators();
          this.decisionForm.controls['idFlujoRetorno'].updateValueAndValidity();
          this.mostrarValidaciones = false;
        }
      }
    );

    this.decisionForm.controls['declaraNulidad'].valueChanges.subscribe(
      (valor: boolean) => {
        this.mostrarOpcionesNulidad = valor;
        if (valor)
          this.decisionForm.controls['idFlujoRetorno'].setValidators([
            Validators.required,
            Validators.min(1),
          ]);
        else {
          this.decisionForm.controls['idFlujoRetorno'].clearValidators();
          this.decisionForm.controls['idFlujoRetorno'].updateValueAndValidity();
          this.mostrarValidaciones = false;
        }
      }
    );
  }

  /**
   * @description llama servicio de obtener apelación, llena el formulario
   */
  private obtenerApelacion() {
    this.abogadoService
      .obtenerApelacion({
        idSolicitudServicio: this.objSol.idSolicitud,
        idTarea: this.objSol.idTarea,
      })
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.llenarFormConsulta(data.data);
          } else {
            this.modalError();
          }
        },
        error: () => {
          this.modalError();
        },
      });
  }

  /**
   * @description llena formulario con resultado de la consulta
   * @param objApelacion objeto apelación
   */
  private llenarFormConsulta(objApelacion: any) {
    this.decisionForm.patchValue({
      aceptaRecurso: objApelacion.aceptaRecurso,
      declaraNulidad: objApelacion.declaraNulidad,
      idApelacion: objApelacion.idApelacion,
      idFlujoRetorno: objApelacion.idFlujoRetorno
        ? objApelacion.idFlujoRetorno
        : 0,
      idSolicitudServicio: objApelacion.idSolicitudServicio,
      idTarea: objApelacion.idTarea,
    });
  }

  /**
   * @description llama servicio que llena select de devolver la tarea
   */
  private consultarTareasApelacion() {
    this.abogadoService
      .consultarTareasApelacion(this.objSol.idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.listaTareaApelacion = data.data;
          }
        },
      });
  }

  /**
   * @description muestra modal de cancelar solicitud
   */
  public cancelarSolicitud() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_SOL,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) {
        this.redireccionar();
      }
    });
  }

  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar() {
    this.router.navigate(['./']);    
  }

  /**
   * @description abre modal con las medidas del auto y asigna el resultado a una variable
   */
  public modalMedidasAuto() {
    const listaMedidas = this.dialog.open(ModalMedidasAutoComponent, {
      width: '60%',
      height: '90%',
      disableClose: true,
      data: {
        idSolicitud: this.objSol.idSolicitud,
        listaMedidas: this.listaMedidas,
      },
    });

    listaMedidas.afterClosed().subscribe((listaM) => {
      this.listaMedidas = [...listaM];
    });
  }

  /**
   * @description abre modal con las medidas del auto
   */
  public modalCargaArchivo() {
    this.dialog.open(ModalCargarDocumentoComponent, {
      width: '50%',
      height: '55%',
      disableClose: true,
    });
  }

  /**
   * @description abre modal generación reporte auto juez
   */
  public modalReporteJuez() {
    this.dialog.open(ModalReporteJuezComponent, {
      width: '40%',
      height: '50%',
      disableClose: true,
    });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.decisionForm.controls[campo]) {
      return this.decisionForm.controls[campo].hasError('min');
    } else {
      return false;
    }
  }

  /**
   * @description valida que el formulario sea válido para actualizar la apelación
   */
  public guardarApelacion() {
    if (this.decisionForm.valid) {
      this.actualizarApelacion(false);
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description muestra modal cerrar actuación
   */
  public modalConfirmaCerrarActuacion() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.actualizarApelacion(true);
    });
  }

  /**
   * @description muestra modal error
   */
  private modalError() {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  /**
   * @description llama servicio cerrar actuación
   */
  public cerrarActuacion() {
    this.abogadoService
      .cerrarActuacionApelacion({
        idSolicitudServicio: this.objSol.idSolicitud,
        idTarea: this.objSol.idTarea,
      })
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_CERRAR_SOLICITUD,
              ImagenesModal.OK,
              this.dialog
            );

            this.redireccionar();
          } else {
            this.modalError();
          }
        },
        error: () => {
          this.modalError();
        },
      });
  }

  /**
   * @description llama servicio que actualiza la apelación
   * @param estado true cerrar actuación false no
   */
  private actualizarApelacion(estado: boolean) {
    this.decisionForm.controls['lstMedidas'].setValue(this.listaMedidas);

    this.abogadoService.actualizarApelacion(this.decisionForm.value).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          if (estado) {
            this.cerrarActuacion();
          } else {
            Modales.modalExito(
              Mensajes.MENSAJE_OK,
              ImagenesModal.OK,
              this.dialog
            );
          }
        } else {
          this.modalError();
        }
      },
      error: () => {
        this.modalError();
      },
    });
  }
}
