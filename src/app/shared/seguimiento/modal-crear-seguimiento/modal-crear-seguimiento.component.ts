import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  NuevoSeguimiento,
  SolicitudPorPersona,
} from 'src/app/pages/private/interfaces/seguimiento.interface';
import { SharedService } from 'src/app/services/shared.service';
import { SeguimientoService } from '../../../services/seguimiento.service';
import { Modales } from '../../modals';

@Component({
  selector: 'app-modal-crear-seguimiento',
  templateUrl: './modal-crear-seguimiento.component.html',
  styleUrls: ['./modal-crear-seguimiento.component.scss'],
})
export class ModalCrearSeguimientoComponent implements OnInit {
  public myForm!: FormGroup;
  private perfil: string = '';
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public selectTipoDocumento: DominioInterface[] = [];
  public selectSolicitudes: SolicitudPorPersona[] = [];
  public mostrarMensajeInformativo: boolean = false;

  constructor(
    private matDialogRef: MatDialogRef<ModalCrearSeguimientoComponent>,
    private fb: FormBuilder,
    private modales: Modales,
    private sharedService: SharedService,
    private authService: AuthService,
    private seguimientosService: SeguimientoService
  ) {
    const { perfil } = this.authService.currentUserValue!;
    this.perfil = perfil!;
  }

  ngOnInit(): void {
    this.cargarForm();
    this.cargaSelectTipoDocumento();
  }

  /**
   * @description carga el formulario
   */
  private cargarForm() {
    this.myForm = this.fb.group({
      tipDoc: ['', [Validators.required]],
      nroDoc: ['', [Validators.required, Validators.pattern(Regex.ALFA)]],
      solicitud: ['', [Validators.required]],
    });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    return this.myForm.controls[campo].hasError('required');
  }

  public cambioPersona(event: any) {
    this.myForm.get('solicitud')?.setValue('');
    if (
      this.myForm.get('tipDoc')?.value !== '' &&
      this.myForm.get('nroDoc')?.value.trim() !== ''
    ) {
      if (event.target.value != 0) {
        this.cargaSelectCodigoSolicitud();
      }
    }
  }

  /**
   * @description carga el select de Tipo Documento
   */
  private cargaSelectTipoDocumento() {
    this.sharedService
      .getDominio('Tipo_identificacion')
      .subscribe((TipoDocumento: ResponseInterface) => {
        if (TipoDocumento.statusCode === CodigosRespuesta.OK) {
          this.selectTipoDocumento = TipoDocumento.data;
        }
      });
  }

  /**
   * @description carga el select de codigos de solicitud por persona
   */
  public cargaSelectCodigoSolicitud() {
    this.mostrarMensajeInformativo = false;
    this.seguimientosService
      .getCodigoSolicitudesPorPersona(
        this.myForm.get('tipDoc')?.value,
        this.myForm.get('nroDoc')?.value.trim()
      )
      .subscribe((codigoSolicitud: ResponseInterface) => {
        if (codigoSolicitud.statusCode === CodigosRespuesta.OK) {
          this.selectSolicitudes = codigoSolicitud.data;
          if (this.selectSolicitudes && this.selectSolicitudes.length === 0) {
            this.mostrarMensajeInformativo = true;
          }
        }
      });
  }

  /**
   * @description confirma crear el seguimiento para la solicitud seleccionada
   */
  confirmar() {
    this.mostrarValidaciones = false;
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      this.crearRegistroTarea();
    }
  }

  /**
   * @description crea el registro de la tarea para inicializar el seguimiento
   */
  private crearRegistroTarea() {
    this.seguimientosService
      .postCrearRegistroTarea(this.myForm.get('solicitud')?.value)
      .subscribe({
        next: (resp: ResponseInterface) => {
          if (resp.statusCode === CodigosRespuesta.OK) {
            this.mensajeConfirmacion();
          } else {
            this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
          }
        },
        error: () => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        },
      });
  }

  /**
   * @description mensaje de confirmación de creación de seguimiento
   */
  private mensajeConfirmacion() {
    this.modales.modalExito(Mensajes.MENSAJE_SEG_EXITO).subscribe(() => {
      this.matDialogRef.close(true);
    });
  }

  /**
   * @description cierra el modal
   */
  public cerrarModal() {
    this.matDialogRef.close(false);
  }
}
