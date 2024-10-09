import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { PreSolicitudService } from 'src/app/pages/private/services/pre-solicitud.service';
import { Modales } from 'src/app/shared/modals';

@Component({
  selector: 'app-verificacion-pre-solicitud',
  templateUrl: './verificacion-pre-solicitud.component.html',
  styleUrls: ['./verificacion-pre-solicitud.component.scss'],
})
export class VerificacionPreSolicitudComponent implements OnInit {
  public form!: FormGroup;
  public formTViolencia!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public guardarDatos: boolean = false;
  public idPresolicitud: number;
  public infoInicial: any = null;
  public tipoPresolicitud!: string;
  public esPARD: boolean = false;
  public perfil: string = '';
  public info: any;
  public user: UserInterface | undefined;

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;

  public lstTipoViolencia: any[] = [];
  public lstCitasDisponibles: any[] = [];

  constructor(
    private presolicitudService: PreSolicitudService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private modales: Modales,
    private router: Router
  ) {
    this.info = JSON.parse(sessionStorage.getItem('info')!);
    this.idPresolicitud = this.info.idSolicitud;
    this.user = this.authService.currentUserValue!;
    this.perfil = this.user.perfil!;
  }

  ngOnInit(): void {
    this.initForm();

    this.presolicitudService.presolicitud$.subscribe({
      next: (data) => {
        if (data) {
          this.guardarDatos = true;
          this.infoInicial = data.presolicitudVERDE;
          this.tipoPresolicitud = data.presolicitudOUT.tipoPresolicitud;
          this.esPARD = data.presolicitudABO.seRealizaraPard;
          this.lstTipoViolencia = this.infoInicial?.listaTiposViolencia;
          this.loadData();
        }
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.formBuilder.group({
      denunciaVerificada: [
        {
          value: 'no',
          disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO',
        },
      ],
      observaciones: [
        { value: '', disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO' },
        Validators.compose([Validators.maxLength(3000), Validators.required]),
      ],
      continuaDenuncia: [
        {
          value: 'no',
          disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO',
        },
      ],
      cita: [
        { value: '', disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO' },
        Validators.required,
      ],
    });
  }

  initFormLstTipoViolencia(lst: any[]) {
    lst.forEach((i, index) => {
      this.form.addControl(
        `${i.idTipoViolencia}`,
        this.formBuilder.control(
          i.estadoTipoViolencia === 1 ? true : false,
          Validators.required
        )
      );
    });
  }

  loadData() {
    this.form = this.formBuilder.group({
      denunciaVerificada: [
        {
          value: this.infoInicial.denunciaVerificada ? 'si' : 'no',
          disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO',
        },
      ],
      observaciones: [
        {
          value: this.infoInicial.observacionesVerificacion,
          disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO',
        },
        Validators.compose([Validators.maxLength(3000), Validators.required]),
      ],
      continuaDenuncia: [
        {
          value: this.infoInicial.continuaDenuncia ? 'si' : 'no',
          disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO',
        },
      ],
      cita: [
        {
          value: null,
          disabled: this.perfil !== 'PSI' && this.perfil !== 'TSO',
        },
        Validators.required,
      ],
    });

    this.initFormLstTipoViolencia(this.lstTipoViolencia);
    this.lstCitasDisponibles = this.infoInicial.listaCitasDisponibles;

    let cita = this.lstCitasDisponibles.find(
      (x) => x.idCita === this.infoInicial.idCita
    );

    if (cita && this.mostrarSelectCitas) {
      this.f.cita.setValue(cita);
    }

    if (!this.infoInicial.continuaDenuncia) {
      this.f.cita.reset();
      this.f.cita.disable();
    }

    this.setDenunciaVerificada();
  }

  public modalConfirmaCerrarActuacion() {
    if (this.form.valid ||
      (this.form.invalid &&
        this.form.get('cita')?.invalid &&
        !this.mostrarSelectCitas)) {
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
   * @description llama servicio cerrar actuación Denuncia en presolicitud
   */
  public cerrarActuacion() {
    this.presolicitudService
      .cerrarActuacionDenuncia(this.retornarObjCerrarActuacion())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (this.f.continuaDenuncia.value === 'si') {
              if (this.tipoPresolicitud == "DEN" && !this.esPARD) {
                this.modales
                  .modalExito(
                    `Se ha cerrado de manera exitosa la presolicitud. Se ha generado una cita para el dia ${this.datePipe.transform(
                      this.f.cita.value.fechaCita,
                      'dd/MM/yyyy'
                    )}
                  a las ${this.datePipe.transform(
                      this.f.cita.value.horaCita,
                      'H:mm:ss'
                    )}`
                  )
                  .subscribe(() => {
                    this.router.navigate(['/psicologia/casos']);
                  });
              } else if (this.tipoPresolicitud == "DEN" && this.esPARD && this.f.continuaDenuncia.value) {
                this.modales
                  .modalExito(
                    `Se ha continuado con el proceso de Reestablecimiento de Derechos`
                  )
                  .subscribe(() => {
                    this.router.navigate(['/psicologia/casos']);
                  });
              } else {
                this.modales
                  .modalExito(
                    `Proceso de presolicitud finalizado`
                  )
                  .subscribe(() => {
                    this.router.navigate(['/psicologia/casos']);
                  });
              }

            } else {
              this.modales
                .modalExito(
                  `Se ha cerrado de manera exitosa la presolicitud. No se continuara con el proceso`
                )
                .subscribe(() => {
                  this.router.navigate(['/psicologia/casos']);
                });
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
  }

  guardar(cerrar: boolean = false) {
    if (
      this.form.valid ||
      (this.form.invalid &&
        this.form.get('cita')?.invalid &&
        !this.mostrarSelectCitas)
    ) {
      const obj = this.getObjGuardar();
      this.presolicitudService.GuardarVerificacionDenuncia(obj).subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (cerrar) {
              this.cerrarActuacion();
            } else {
              this.modales.modalExito('Se ha guardado la información');
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
      idTarea: this.info.idTarea,
      idSolicitudServicio: this.idPresolicitud,
      idCita: this.f.cita?.value?.idCita ? this.f.cita?.value?.idCita : 0,
    };
  }

  getObjGuardar(): any {
    this.lstTipoViolencia.forEach((x) => {
      x.estadoTipoViolencia = this.form.controls[`${x.idTipoViolencia}`].value
        ? 1
        : 0;
      x.idSolicitudServicio = this.idPresolicitud;
    });

    return {
      idSolicitudServicio: this.idPresolicitud,
      denunciaVerificada:
        this.f.denunciaVerificada.value === 'si' ? true : false,
      observacionesVerificacion: this.f.observaciones.value,
      continuaDenuncia: this.f.continuaDenuncia.value === 'si' ? true : false,
      idCita: this.f.cita.value ? this.f.cita.value.idCita : 0,
      fechaCita: this.f.cita.value ? this.f.cita.value.fechaCita : '',
      listaTiposViolencia: this.lstTipoViolencia,
    };
  }

  changePregunta(e: any) {
    if (e.target.value === 'si') {
      this.f.cita.enable();
      this.f.cita.reset();
    } else {
      this.f.cita.disable();
      this.f.cita.reset();
    }
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

  public setDenunciaVerificada() {
    const value = this.form.get('denunciaVerificada')?.value;
    if (value === 'no') {
      this.form.get('continuaDenuncia')?.setValue('no');
      this.changePregunta({ target: { value: 'no' } });
    }
    this.changePregunta({
      target: { value: this.mostrarSelectCitas ? 'si' : 'no' },
    });
  }

  get mostrarSelectCitas() {
    const isContinua = this.form.get('continuaDenuncia')?.value === 'si';
    const isDenuncia = this.tipoPresolicitud === 'DEN' && !this.esPARD;

    return isContinua && isDenuncia ? true : false;
  }
}
