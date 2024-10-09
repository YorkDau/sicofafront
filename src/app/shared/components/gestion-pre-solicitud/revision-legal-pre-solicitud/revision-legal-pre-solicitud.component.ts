import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { PreSolicitudService } from 'src/app/pages/private/services/pre-solicitud.service';
import { Modales } from 'src/app/shared/modals';

@Component({
  selector: 'app-revision-legal-pre-solicitud',
  templateUrl: './revision-legal-pre-solicitud.component.html',
  styleUrls: ['./revision-legal-pre-solicitud.component.scss']
})
export class RevisionLegalPreSolicitudComponent implements OnInit {

  public mostrarValidaciones: boolean = false;
  public idPresolicitud: number;
  public form!: FormGroup;
  public infoInicial: any = null;
  public perfil: string = '';
  public delete: boolean = true;
  public info: any;
  public iFile: ArchivoInterface = {};
  public user!: UserInterface | undefined;

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;

  constructor(
    private presolicitudService: PreSolicitudService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private modales: Modales,
    private router: Router
  ) {
    this.info = JSON.parse(sessionStorage.getItem("info")!);
    this.idPresolicitud = this.info.idSolicitud;
    this.user = this.authService.currentUserValue!;
    this.perfil = this.user.perfil!;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.initForm();

    this.presolicitudService.presolicitud$
      .subscribe({
        next: (data) => {
          if (data) {
            this.infoInicial = data.presolicitudABO;
            this.loadData();
          }
        }
      })

  }

  initForm() {
    this.form = this.formBuilder.group({
      competenciaComisaria: [{ value: 'no', disabled: this.perfil !== 'ABO' }],
      procesoPard: [{ value: 'no', disabled: this.perfil !== 'ABO' }],
      observaciones: [{ value: '', disabled: this.perfil !== 'ABO' }, Validators.compose([Validators.maxLength(3000), Validators.required])],
      adjunto: '',
      idArchivo: null
    });
  }

  loadData() {
    this.form = this.formBuilder.group({
      competenciaComisaria: [{ value: this.infoInicial.esCompetenciaComisaria ? 'si' : 'no', disabled: this.perfil !== 'ABO' }],
      procesoPard: [{ value: this.infoInicial.seRealizaraPard ? 'si' : 'no', disabled: this.perfil !== 'ABO' }],
      observaciones: [{ value: this.infoInicial.observacionesLegalidad, disabled: this.perfil !== 'ABO' }, Validators.compose([Validators.maxLength(3000), Validators.required])],
      adjunto: '',
      idArchivo: this.infoInicial.idAnexoAutoTramite
    });

    if (this.infoInicial.idAnexoAutoTramite !== '' && this.infoInicial.idAnexoAutoTramite !== 0 && this.perfil !== 'ABO') {
      this.delete = false;
      this.iFile.idArchivo = this.infoInicial.idAnexoAutoTramite;
      this.iFile.idSolicitud = this.info.idSolicitud;
    } else if (this.infoInicial.idAnexoAutoTramite !== '' && this.infoInicial.idAnexoAutoTramite !== 0 && this.perfil === 'ABO') {
      this.delete = true;
      this.iFile.idArchivo = this.infoInicial.idAnexoAutoTramite;
      this.iFile.idSolicitud = this.info.idSolicitud;
    } else {
      this.delete = true;
    }
  }

  cargarArchivo(base64: string) {
    if (base64) {
      this.f.adjunto.setValue(base64);
    }
  }

  public modalConfirmaCerrarActuacion() {
    if (this.form.valid) {
      Modales.modalConfirmacion(
        Mensajes.MENSAJE_CERRAR_ACT,
        this.dialog,
        ImagenesModal.EXCLAMACION
      ).subscribe((res) => {
        if (res) this.guardar(true);
      });
    } else {
      this.mostrarValidaciones = true;
    }

  }

  /**
  * @description llama servicio cerrar actuación
  */
  public cerrarActuacion() {

    this.presolicitudService
      .cerrarActuacion(this.retornarObjCerrarActuacion())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.modales
              .modalExito(
                `Se ha registrado la competencia de la Pre-Solicitud de servicio.
              El caso ha sido enviado al equipo psicosocial para la verificacion de la denuncia.`
              )
              .subscribe(() => {
                this.router.navigate(['/abogado/casos']);
              });
          } else {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              ImagenesModal.EXCLAMACION
            );
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        },
      });

  }

  guardar(cerrar: boolean = false) {
    if (this.form.valid) {

      const obj = this.getObjGuardar();
      this.presolicitudService.GuardarDecisionJuridica(obj).subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {

            if (cerrar) {
              this.cerrarActuacion();
            } else {
              this.modales.modalExito('Se ha guardado la informacion');
            }

          } else {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              ImagenesModal.EXCLAMACION
            );
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        },
      });
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
     * @description arma objeto para cerrar la actuación
     * @returns interface
     */
  private retornarObjCerrarActuacion(): any {
    return {
      tareaID: this.info.idTarea,
      userID: this.user?.userID,
      perfilCod: this.user?.perfil,
      valorEtiqueta: this.f.competenciaComisaria.value === 'si' ? 1 : 0
    };
  }

  getObjGuardar(): any {
    return {
      idSolicitudServicio: this.idPresolicitud,
      esCompetenciaComisaria: this.f.competenciaComisaria.value === 'si' ? true : false,
      seRealizaraPard: this.f.procesoPard.value === 'si' ? true : false,
      observacionesLegalidad: this.f.observaciones.value,
      adjuntoAutoTramite: this.f.adjunto.value
    };
  }



  /**
   * @descripcion redirige a la consulta de tareas
   */
  cancelar() {
    this.modales.modalCancelar('/abogado/casos');
  }

  /**
 * @description valida que el campo cumpla la expresión regular
 * @param campo campo a validar del form
 * @returns boleano
 */
  public maxLength(campo: string): boolean {
    if (this.form.controls[campo]) {
      return this.form.controls[campo].hasError('maxlength');
    } else {
      return false;
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    return this.form.controls[campo].hasError('required');
  }

}
