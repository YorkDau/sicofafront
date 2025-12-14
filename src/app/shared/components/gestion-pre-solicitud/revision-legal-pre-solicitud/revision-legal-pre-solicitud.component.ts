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
      idEntidadTraslado: null,
      justificacionTraslado: '',
      verificacionDerecho: null,
    });
  }
  loadData() {
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
      idEntidadTraslado: this.infoInicial.idEntidadTraslado,
      justificacionTraslado: this.infoInicial.justificacionTraslado,
    });

    // Validaciones al cargar datos
    if (this.infoInicial.hechosExistentes === 'Inobservancia') {
      this.f.justificacionTraslado.setValidators(
        Validators.compose([Validators.maxLength(3000), Validators.required])
      );
      this.f.idEntidadTraslado.setValidators([Validators.required]);

      this.f.justificacionTraslado.updateValueAndValidity();
      this.f.idEntidadTraslado.updateValueAndValidity();
    } else {
      this.f.justificacionTraslado.setValidators(null);
      this.f.idEntidadTraslado.setValidators(null);

      this.f.justificacionTraslado.updateValueAndValidity();
      this.f.idEntidadTraslado.updateValueAndValidity();
    }
    
    // Aplicar la validación condicional de observaciones al cargar los datos
    this.actualizarValidacionObservaciones();

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
  // En RevisionLegalPreSolicitudComponent
  public cambiarCompetenciaComisaria() {
    // Limpiamos la selección de hechos existentes.
    this.f.hechosExistentes.setValue(null);
    this.f.hechosExistentes.updateValueAndValidity();

    // Limpieza de archivos de Auto-Trámite
    this.f.adjunto.setValue('');
    this.f.idArchivo.setValue(null);
    this.iFile = {};

    // Limpieza de archivos de Constancia de Traslado
    this.f.idAdjuntoConstanciaTraslado.setValue(null);
    this.f.adjuntoConstanciaTraslado.setValue('');
    this.iFileConstancia = {};

    // Limpiamos también el proceso PARD y el traslado PARD si es necesario.
    if (this.f.competenciaComisaria.value === 'no') {
      this.f.procesoPard.setValue('no');
      this.f.trasladoPard.setValue('no');
      this.f.procesoPard.updateValueAndValidity();
      this.f.trasladoPard.updateValueAndValidity();
      // Llamamos a actualizarHechos para eliminar la validación de justificación y entidad si existía.
      this.actualizarHechos('');
    } else {
      // Si vuelve a 'si', aseguramos que la justificación no sea requerida y limpiamos campos de traslado (Entidad, Justificación)
      this.actualizarHechos(''); 
    }

    // Reevaluar la validación de observaciones
    this.actualizarValidacionObservaciones();
  }
  // En RevisionLegalPreSolicitudComponent
  public actualizarValidacionObservaciones() {
    const competenciaNo = this.f.competenciaComisaria.value === 'no';
    const hechosInobservancia =
      this.f.hechosExistentes.value === 'Inobservancia';

    // Si NO es competencia de la comisaría Y se selecciona Inobservancia, el campo Observaciones NO es requerido.
    if (competenciaNo && hechosInobservancia) {
      this.f.observaciones.setValidators([Validators.maxLength(3000)]);
    } else {
      // En cualquier otro caso, el campo Observaciones SI es requerido.
      this.f.observaciones.setValidators([
        Validators.maxLength(3000),
        Validators.required,
      ]);
    }

    this.f.observaciones.updateValueAndValidity();
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
  
  /**
   * @description Determina si se requiere un archivo (Formato Firmado o Constancia de Traslado)
   * @returns boolean
   */
  public tieneArchivoFirmado(): boolean {
    const esTrasladoInobservancia =
        this.f.competenciaComisaria.value === 'no' &&
        this.f.hechosExistentes.value === 'Inobservancia';

    if (esTrasladoInobservancia) {
        // Escenario 1: Traslado por Inobservancia (Requiere la Constancia de Traslado)
        return !!(
            this.f.adjuntoConstanciaTraslado.value ||
            this.f.idAdjuntoConstanciaTraslado.value ||
            this.infoInicial?.idAdjuntoConstanciaTraslado
        );
    }

    if (this.esMenorEdad) {
        // Escenario 2: Otros casos de Menor de Edad (Requiere el Formato Firmado/Auto Trámite)
        return !!(
            this.f.adjunto.value ||
            this.f.idArchivo.value ||
            this.infoInicial?.idAnexoAutoTramite
        );
    }
    
    // Casos de Adulto Mayor donde no hay Traslado por Inobservancia
    return true; 
  }

  public modalConfirmaCerrarActuacion() {
    if (this.form.valid && this.tieneArchivoFirmado()) {
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
                  : this.f.competenciaComisaria.value === 'no'
                  ? 'No se verifica la denuncia'
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

      // Limpiamos campos de traslado por Inobservancia
      this.f.idEntidadTraslado.setValue(null);
      this.f.justificacionTraslado.setValue('');
      
      // LÍNEA CLAVE: Limpiamos los archivos de la Constancia de Traslado
      this.f.idAdjuntoConstanciaTraslado.setValue(null);
      this.f.adjuntoConstanciaTraslado.setValue('');
      this.iFileConstancia = {};

      this.f.comisariaSeleccionada.clearValidators();
    } else {
      this.f.comisariaSeleccionada.clearValidators();
      this.f.hechosExistentes.setValue(null);
      
      // Limpiamos los archivos de Auto-Trámite/Formato Firmado si se desactiva el PARD (Aunque esta sección solo debería verse si PARD fue 'si')
      this.f.adjunto.setValue('');
      this.f.idArchivo.setValue(null);
      this.iFile = {};
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
  // En RevisionLegalPreSolicitudComponent
  public actualizarHechos(hechos: string) {
    // 1. Lógica para Justificación del Traslado y Entidad
    if (hechos === 'Inobservancia') {
      this.f.justificacionTraslado.setValidators(
        Validators.compose([Validators.maxLength(3000), Validators.required])
      );
      this.f.idEntidadTraslado.setValidators([Validators.required]); 

      // LÓGICA AGREGADA: Si hay Inobservancia, reseteamos PARD y traslado PARD
      this.f.procesoPard.setValue('no');
      this.f.trasladoPard.setValue('no');
      this.f.procesoPard.updateValueAndValidity();
      this.f.trasladoPard.updateValueAndValidity();
      
      // LÍNEA CLAVE: Limpiamos los archivos de Auto-Trámite (ya no son requeridos aquí)
      this.f.adjunto.setValue('');
      this.f.idArchivo.setValue(null);
      this.iFile = {};

    } else {
      this.f.justificacionTraslado.setValidators(null);
      this.f.idEntidadTraslado.setValidators(null);
      
      // Limpiamos los valores de Entidad y Justificación
      this.f.idEntidadTraslado.setValue(null);
      this.f.justificacionTraslado.setValue('');
      
      // LÍNEA CLAVE: Limpiamos los archivos de la Constancia de Traslado
      this.f.idAdjuntoConstanciaTraslado.setValue(null); 
      this.f.adjuntoConstanciaTraslado.setValue('');
      this.iFileConstancia = {};
    }
    this.f.justificacionTraslado.updateValueAndValidity();
    this.f.idEntidadTraslado.updateValueAndValidity();

    // 2. Lógica para Observaciones (no requerido si 'no' competencia + 'Inobservancia')
    this.actualizarValidacionObservaciones();
  }
}