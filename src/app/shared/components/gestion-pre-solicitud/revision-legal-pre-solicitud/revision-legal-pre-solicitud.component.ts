import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
// Interfaz para consulta de entidades
import { PreSolicitudService } from 'src/app/pages/private/services/pre-solicitud.service';
import { Modales } from 'src/app/shared/modals';

import { SolicitudService } from 'src/app/pages/private/services/solicitud.service';
import { EntidadInterface } from 'src/app/pages/private/interfaces/solicitud.interface';
import { SharedService } from 'src/app/services/shared.service';
import { ComisariaInterface } from 'src/app/pages/public/interfaces/comisaria.interface';

@Component({
  selector: 'app-revision-legal-pre-solicitud',
  templateUrl: './revision-legal-pre-solicitud.component.html',
  styleUrls: ['./revision-legal-pre-solicitud.component.scss'],
})
export class RevisionLegalPreSolicitudComponent implements OnInit {
  public mostrarValidaciones: boolean = false;
  public idPresolicitud: number;
  public form!: FormGroup;
  public infoInicial: any = null;
  public perfil: string = '';
  public delete: boolean = true;
  public deleteConstancia: boolean = true;
  public esMenorEdad: boolean = true;
  public esAdultoMayor: boolean = true;
  

  public info: any;
  public iFile: ArchivoInterface = {};
  public iFileConstancia: ArchivoInterface = {}; // Constancia
  public user!: UserInterface | undefined;

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;
  public selectEntidad: EntidadInterface[] = [];
  public selectComisaria: ComisariaInterface[] = [];

  public comisariaSeleccionada!: number | null;

  constructor(
    private presolicitudService: PreSolicitudService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private modales: Modales,
    private router: Router,
    private solicitudService: SolicitudService,
    private sharedService: SharedService
  ) {
    this.info = JSON.parse(sessionStorage.getItem('info')!);
    this.idPresolicitud = this.info.idSolicitud;
    this.user = this.authService.currentUserValue!;
    this.perfil = this.user.perfil!;
    this.esMenorEdad = this.info.tipo_presolicitud !== 'DENAM';
    this.esAdultoMayor = this.info.tipo_presolicitud === 'DENAM';
    this.cargaSelectComisaria();
  }
  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.initForm();
    this.cargaSelectEntidad();
    this.cargaSelectComisaria();

    this.presolicitudService.presolicitud$.subscribe({
      next: (data) => {
        if (data) {
          this.infoInicial = data.presolicitudABO;
          this.loadData();
        }
      },
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      competenciaComisaria: [{ value: 'no', disabled: this.perfil !== 'ABO' }],
      procesoPard: [{ value: 'no', disabled: this.perfil !== 'ABO' }],
      trasladoPard: [{ value: 'no', disabled: this.perfil !== 'ABO' }],
      observaciones: [
        { value: '', disabled: this.perfil !== 'ABO' },
        Validators.compose([Validators.maxLength(3000), Validators.required]),
      ],
      adjunto: '',
      idArchivo: null,

      idAdjuntoConstanciaTraslado: null,
      adjuntoConstanciaTraslado: '',
      hechosExistentes: null,
      comisariaSeleccionada: null,
      //seguirTramitePrevencion: null,
      idEntidadTraslado: null,
      justificacionTraslado: '',
      verificacionDerecho: null,
    });
  }
  loadData() {
    console.log(this.infoInicial)
    this.form = this.formBuilder.group({
      competenciaComisaria: [
        {
          value: this.infoInicial.esCompetenciaComisaria ? 'si' : 'no',
          disabled: this.perfil !== 'ABO',
        },
      ],
      trasladoPard: [
        {
          value: this.infoInicial.trasladoPard ? 'si' : 'no',
          disabled: this.perfil !== 'ABO',
        },
      ],
      procesoPard: [
        {
          value: this.infoInicial.seRealizaraPard ? 'si' : 'no',
          disabled: this.perfil !== 'ABO',
        },
      ],
      observaciones: [
        {
          value: this.infoInicial.observacionesLegalidad,
          disabled: this.perfil !== 'ABO',
        },
        Validators.compose([Validators.maxLength(3000), Validators.required]),
      ],
      adjunto: '',
      idArchivo: this.infoInicial.idAnexoAutoTramite,
      verificacionDerecho: null,

      idAdjuntoConstanciaTraslado: this.infoInicial.idAdjuntoConstanciaTraslado,
      adjuntoConstanciaTraslado: '',
      hechosExistentes: this.infoInicial.hechosExistentes,
      comisariaSeleccionada: this.infoInicial.comisariaSeleccionada || null,
      //seguirTramitePrevencion: this.infoInicial.seguirTramitePrevencion,
      idEntidadTraslado: this.infoInicial.idEntidadTraslado,
      justificacionTraslado: this.infoInicial.justificacionTraslado,
    });

    if (this.infoInicial.hechosExistentes === 'Inobservancia') {
      this.f.justificacionTraslado.setValidators(
        Validators.compose([Validators.maxLength(3000), Validators.required])
      );
      this.f.justificacionTraslado.updateValueAndValidity();
    } else {
      this.f.justificacionTraslado.setValidators(null);
      this.f.justificacionTraslado.updateValueAndValidity();
    }

    if (
      this.infoInicial.idAnexoAutoTramite !== '' &&
      this.infoInicial.idAnexoAutoTramite !== 0 &&
      this.perfil !== 'ABO'
    ) {
      this.delete = false;
      this.iFile.idArchivo = this.infoInicial.idAnexoAutoTramite;
      this.iFile.idSolicitud = this.info.idSolicitud;
    } else if (
      this.infoInicial.idAnexoAutoTramite !== '' &&
      this.infoInicial.idAnexoAutoTramite !== 0 &&
      this.perfil === 'ABO'
    ) {
      this.delete = true;
      this.iFile.idArchivo = this.infoInicial.idAnexoAutoTramite;
      this.iFile.idSolicitud = this.info.idSolicitud;
    } else {
      this.delete = true;
    }

    if (
      this.infoInicial.idAdjuntoConstanciaTraslado !== '' &&
      this.infoInicial.idAdjuntoConstanciaTraslado !== 0 &&
      this.perfil !== 'ABO'
    ) {
      this.deleteConstancia = false;
      this.iFileConstancia.idArchivo =
        this.infoInicial.idAdjuntoConstanciaTraslado;
      this.iFileConstancia.idSolicitud = this.info.idSolicitud;
    } else if (
      this.infoInicial.idAdjuntoConstanciaTraslado !== '' &&
      this.infoInicial.idAdjuntoConstanciaTraslado !== 0 &&
      this.perfil === 'ABO'
    ) {
      this.deleteConstancia = true;
      this.iFileConstancia.idArchivo =
        this.infoInicial.idAdjuntoConstanciaTraslado;
      this.iFileConstancia.idSolicitud = this.info.idSolicitud;
    } else {
      this.deleteConstancia = true;
    }
  }
  onChangeComisaria() {
    this.comisariaSeleccionada;
  }
  private cargaSelectComisaria() {
    const idComisaria = this.authService.currentUserValue?.idComisaria;
    this.solicitudService
      .getComisariaTraslado(idComisaria)
      .subscribe((comisaria) => {
        if (comisaria.statusCode === CodigosRespuesta.OK) {
          this.selectComisaria = comisaria.data;
        }
      });
  }
  cargarArchivo(base64: string) {
    if (base64) {
      this.f.adjunto.setValue(base64);
    }
  }
  cargarConstancia(base64: string) {
    if (base64) {
      this.f.adjuntoConstanciaTraslado.setValue(base64);
    }
  }
  public tieneArchivoFirmado(): boolean {
  return !!(this.f.adjunto.value || 
           this.f.idArchivo.value || 
           this.infoInicial?.idAnexoAutoTramite);
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
            const hechosExistentes = this.f.hechosExistentes.value;
            console.log('HECHOS', hechosExistentes);

            let mensaje =
              'Se ha registrado la competencia de la Pre-Solicitud de servicio.';

            if (hechosExistentes === 'Inobservancia') {
              mensaje += ' se remitió a otra entidad.';
            } else {
              mensaje += ` ${
                this.esMenorEdad
                  ? 'El caso ha sido enviado al equipo psicosocial para la verificacion de la denuncia.'
                  : 'El caso ha sido enviado al equipo psicosocial para la verificacion de la denuncia.'
              }`;
            }

            this.modales.modalExito(mensaje).subscribe(() => {
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
      valorEtiqueta: this.f.competenciaComisaria.value === 'si' ? 1 : 0,
    };
  }

  getObjGuardar(): any {
    return {
      idSolicitudServicio: this.idPresolicitud,
      esCompetenciaComisaria:
        this.f.competenciaComisaria.value === 'si' ? true : false,
      seRealizaraPard: this.f.procesoPard.value === 'si' ? true : false,
      trasladoPard: this.f.trasladoPard.value === 'si' ? true : false,
      observacionesLegalidad: this.f.observaciones.value,
      adjuntoAutoTramite: this.f.adjunto.value,

      idAdjuntoConstanciaTraslado: this.f.idAdjuntoConstanciaTraslado.value,
      adjuntoConstanciaTraslado: this.f.adjuntoConstanciaTraslado.value,
      hechosExistentes: this.f.hechosExistentes.value ?? null,
      comisariaSeleccionada: this.f.comisariaSeleccionada.value ?? 0,
      //seguirTramitePrevencion:this.f.seguirTramitePrevencion.value == 1 ? true : false,
      idEntidadTraslado: this.f.idEntidadTraslado.value,
      justificacionTraslado: this.f.justificacionTraslado.value,
      verificacionDerecho: this.f.verificacionDerecho.value === 'si' ? 1 : 0,
      idComisariaUsuario: this.user?.idComisaria,
      idUsuario: this.user?.userID,
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
public actualizarValidacionComisaria() {
  const trasladoPardValue = this.f.trasladoPard.value;
  
  if (trasladoPardValue === 'si') {
    this.f.comisariaSeleccionada.setValidators([Validators.required]);
    this.f.hechosExistentes.setValue('Amenaza o vulneración de derechos');
    
    this.f.idEntidadTraslado.setValue(null);
    this.f.justificacionTraslado.setValue('');
    this.f.idAdjuntoConstanciaTraslado.setValue(null);
    this.f.adjuntoConstanciaTraslado.setValue('');
    
    this.f.comisariaSeleccionada.clearValidators();
    
  } else {
    this.f.comisariaSeleccionada.clearValidators();
    
    this.f.hechosExistentes.setValue(null);
  }
  
  this.f.comisariaSeleccionada.updateValueAndValidity();
  this.f.hechosExistentes.updateValueAndValidity();
}


  /**
   * @description carga el select de entidad
   */
  private cargaSelectEntidad() {
    this.solicitudService.getEntidades().subscribe((entidad) => {
      if (entidad.statusCode === CodigosRespuesta.OK) {
        this.selectEntidad = entidad.data;
      }
    });
  }


  public descargarDocumento(): void {
    const nombre: string = 'FORMATO TRASLADO CASO.pdf';

    this.sharedService.descargarFormatos(nombre, 'ss').subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          const source = `data:application/pdf;base64,${data.data}`;
          const link = document.createElement('a');
          const fileName = nombre;
          link.href = source;
          link.download = `${fileName}`;
          link.click();
        } else {
          this.msgError();
        }
      },
      error: () => {
        this.msgError();
      },
    });
  }
  /**
   * @description mensaje de error para lo servicios
   */
  private msgError() {
    this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
  }
  public actualizarHechos(value: String) {
    this.form.patchValue({ idAdjuntoConstanciaTraslado: null });
    this.form.patchValue({ adjuntoConstanciaTraslado: '' });
    //this.form.patchValue({ seguirTramitePrevencion: null });
    this.form.patchValue({ idEntidadTraslado: null });

    this.form.patchValue({ justificacionTraslado: '' });
    if (value === 'Inobservancia') {
      this.form.controls['justificacionTraslado'].setValidators(
        Validators.compose([Validators.maxLength(3000), Validators.required])
      );
      this.form.controls['justificacionTraslado'].updateValueAndValidity();
    } else {
      this.form.controls['justificacionTraslado'].setValidators(null);
      this.form.controls['justificacionTraslado'].updateValueAndValidity();
    }
  }

  

  // /**
  //  * @description carga el select de comisaria
  //  */
  // private cargaSelectComisaria() {
  //   this.solicitudService.getComisariaTraslado(this.user?.idComisaria).subscribe((comisaria) => {
  //     if (comisaria.statusCode === CodigosRespuesta.OK) {
  //       this.selectComisaria = comisaria.data;
  //     }
  //   });
  // }
}
