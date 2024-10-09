import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  Regex,
} from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { PreSolicitudService } from 'src/app/pages/private/services/pre-solicitud.service';
import { SharedFunctions } from 'src/app/shared/functions';
import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';

interface infoCiudadano {
  idCiudadano: number;
  nombreCompleto: string;
  nombreCiudadano: string;
  primerApellido: string;
  segundoApellido: string;
  tipoDocumento: string;
  celular: string;
  telefono: string;
  direccion: string;
  edad: number;
  fechaNacimiento: string;
  correoElectronico: string;
  numeroDocumento: string;
  registroCompleto: boolean;
  solicitudesCiudadano: any[];
}

@Component({
  selector: 'app-recepcion-pre-solicitud',
  templateUrl: './recepcion-pre-solicitud.component.html',
  styleUrls: ['./recepcion-pre-solicitud.component.scss'],
})
export class RecepcionPreSolicitudComponent implements OnInit {
  public form!: FormGroup;
  public formDatos!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public mostrarCasos: boolean = false;
  public mostrarAlertaCasos: boolean = false;
  public infoVictima!: infoCiudadano | null;
  public infoInicial: any = null;
  public load: boolean = false;
  public crear: boolean = false;
  public delete: boolean = true;
  public perfil: string = '';

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;

  public iFile: ArchivoInterface = {};

  public listaTipoDocumento: DominioInterface[] = [];
  public listaTipoEntidad: DominioInterface[] = [];
  public listaCasosAsociados: DominioInterface[] = [];
  public user!: UserInterface | undefined;

  constructor(
    private preSolicitudService: PreSolicitudService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private config: NgSelectConfig,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private modales: Modales,
    private router: Router
  ) {
    this.config.notFoundText = 'No se encontraron coincidencias';
    this.user = this.authService.currentUserValue!;
    this.perfil = this.user.perfil!;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.load = false;

    this.store.select('tipo_entidad').subscribe(({ tipo_entidad }) => {
      this.listaTipoEntidad = tipo_entidad;
    });

    this.store.select('tipo_documento').subscribe(({ tipo_documento }) => {
      this.listaTipoDocumento = tipo_documento;
    });

    this.preSolicitudService.presolicitud$
      .subscribe({
        next: (data) => {
          if (data) {
            this.infoInicial = data.presolicitudOUT;
            this.loadData();
            this.crear = false;
            this.load = true;
          } else if (this.preSolicitudService.crear && !data) {
            this.initFormInicial();
            this.crear = true;
            this.load = true;
          }
        }
      });
  }

  initFormInicial() {
    this.form = this.formBuilder.group({
      id_tipo_entidad: [{value: '', disabled: this.perfil !== 'AUX'}, Validators.required],
      id_tipo_documento: [{value: '', disabled: this.perfil !== 'AUX'}],
      numero_documento: [{value: '', disabled: this.perfil !== 'AUX'}],
      nombre_completo: [{value: '', disabled: this.perfil !== 'AUX'}],
      correo_electronico: [{value: '', disabled: this.perfil !== 'AUX'}, Validators.pattern(Regex.EMAIL)],
      telefono: [{value: '', disabled: this.perfil !== 'AUX'}, Validators.pattern(Regex.NUMERO)],
      archivoAdjunto: [{value: '', disabled: this.perfil !== 'AUX'}],
      descripcion_hechos: [
        {value: '', disabled: this.perfil !== 'AUX'},
        Validators.compose([Validators.required, Validators.maxLength(3000)]),
      ],
      tipo_presolicitud: [{value: 'DEN', disabled: this.perfil !== 'AUX'}, Validators.required],
      id_tipo_documento_Victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      numero_documento_victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      primer_nombre_victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      segundo_nombre_victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      primer_apellido_victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      segundo_apellido_victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      direccion_victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      telefono_victima: [{value: '', disabled: this.perfil !== 'AUX'}],
      correo_electronico_victima: [{value: '', disabled: this.perfil !== 'AUX'}, Validators.pattern(Regex.EMAIL)],
      id_caso_asociado: [{value: null, disabled: this.perfil !== 'AUX'}],
      datos_adicionales_victima: [
        {value: '', disabled: this.perfil !== 'AUX'},
        Validators.compose([Validators.maxLength(3000)]),
      ],
      obl: ['', Validators.required],
    });

    // datos denunciante
    this.f.numero_documento.disable();
    this.f.nombre_completo.disable();
    this.f.correo_electronico.disable();
    this.f.telefono.disable();

    // datos Victima
    this.f.numero_documento_victima.disable();
    this.f.primer_nombre_victima.disable();
    this.f.segundo_nombre_victima.disable();
    this.f.primer_apellido_victima.disable();
    this.f.segundo_apellido_victima.disable();
    this.f.direccion_victima.disable();
    this.f.telefono_victima.disable();
    this.f.correo_electronico_victima.disable();
    this.f.id_caso_asociado.disable();
  }

  loadData() {
    this.form = this.formBuilder.group({
      id_tipo_entidad: [
        { value: this.infoInicial.tipo_entidad_denunciante, disabled: true },
        Validators.required,
      ],
      id_tipo_documento: {
        value: this.infoInicial.tipo_documento_denunciante,
        disabled: true,
      },
      numero_documento: {
        value: this.infoInicial.numero_documento_denunciante,
        disabled: true,
      },
      nombre_completo: {
        value: this.infoInicial.nombres_denunciante,
        disabled: true,
      },
      correo_electronico: [
        { value: this.infoInicial.correo_denunciante, disabled: true },
        Validators.pattern(Regex.EMAIL),
      ],
      telefono: [
        { value: this.infoInicial.telefono_denunciante, disabled: true },
        Validators.pattern(Regex.NUMERO),
      ],
      archivoAdjunto: '',
      descripcion_hechos: [
        { value: this.infoInicial.descripcion_hechos, disabled: true },
        Validators.compose([Validators.required, Validators.maxLength(3000)]),
      ],
      tipo_presolicitud: [
        { value: this.infoInicial.tipoPresolicitud, disabled: true },
        Validators.required,
      ],
      id_tipo_documento_Victima: {
        value: this.infoInicial.tipo_documento_victima,
        disabled: true,
      },
      numero_documento_victima: {
        value: this.infoInicial.num_documento_victima,
        disabled: true,
      },
      primer_nombre_victima: {
        value: this.infoInicial.primer_nombre_victima,
        disabled: true,
      },
      segundo_nombre_victima: {
        value: this.infoInicial.segundo_nombre_victima,
        disabled: true,
      },
      primer_apellido_victima: {
        value: this.infoInicial.primer_apellido_victima,
        disabled: true,
      },
      segundo_apellido_victima: {
        value: this.infoInicial.segundo_apellido_victima,
        disabled: true,
      },
      direccion_victima: {
        value: this.infoInicial.direccion_victima,
        disabled: true,
      },
      telefono_victima: {
        value: this.infoInicial.telefono_victima,
        disabled: true,
      },
      correo_electronico_victima: [
        { value: this.infoInicial.correo_electronico_victima, disabled: true },
        Validators.pattern(Regex.EMAIL),
      ],
      id_caso_asociado: [{ value: this.infoInicial.idSolicitudRelacionado, disabled: true }],
      datos_adicionales_victima: [
        { value: this.infoInicial.datos_adicionales_victima, disabled: true },
        Validators.maxLength(3000),
      ],
      obl: [{ value: '', disabled: true }, Validators.required],
    });

    if (this.infoInicial.id_anexo !== '' || this.infoInicial.id_anexo !== 0) {
      this.iFile.idArchivo = this.infoInicial.id_anexo;
      this.iFile.idSolicitud = this.infoInicial.id_solicitud;
      this.delete = false;
    }

    if(this.infoInicial.idSolicitudRelacionado && this.infoInicial.idSolicitudRelacionado !== 0){
      this.listaCasosAsociados = [...this.infoInicial.solicitudesCiudadano];
      this.mostrarCasos = true;
    }

  }

  getInformacionCiudadano(e: any, actor: string) {

    if (this.mostrarValidaciones) {
      this.mostrarValidaciones = false;
    }

    if (actor === 'D' && this.f.numero_documento.value === "") {
      Modales.modalInformacion(
        'El número de documento del denunciante no puede estar vacio.',
        this.dialog,
        ImagenesModal.EXCLAMACION
      );
    } else if (actor !== 'D' && this.f.numero_documento_victima.value === "") {
      Modales.modalInformacion(
        'El número de documento de la victima no puede estar vacio.',
        this.dialog,
        ImagenesModal.EXCLAMACION
      );
    } else {
      let info;
      this.preSolicitudService
        .getInfoCiudadano(
          actor === 'D'
            ? this.f.id_tipo_documento.value
            : this.f.id_tipo_documento_Victima.value,
          actor === 'D'
            ? this.f.numero_documento.value
            : this.f.numero_documento_victima.value
        )
        .subscribe({
          next: (infoCiudadano) => {
            if (infoCiudadano.statusCode === CodigosRespuesta.OK) {
              info = infoCiudadano.data as infoCiudadano;
            } else {
              info = null;
            }
            this.infoVictima = info;

            if (actor === 'D') {
              this.loadInfoDenunciante(info);
            } else {
              this.loadInfoVictima(info);
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

  }

  loadInfoDenunciante(info: infoCiudadano | null) {
    if (info) {
      this.f.nombre_completo.setValue(info.nombreCompleto);
      this.f.correo_electronico.setValue(info.correoElectronico);
      this.f.telefono.setValue(info.telefono);
    }
    this.f.numero_documento.disable();
    this.f.nombre_completo.enable();
    this.f.correo_electronico.enable();
    this.f.telefono.enable();
  }

  loadInfoVictima(info: infoCiudadano | null) {
    this.listaCasosAsociados = [];
    this.f.id_caso_asociado.setValue(null);
    if (
      info &&
      info.solicitudesCiudadano.length <= 0 &&
      this.f.tipo_presolicitud.value !== 'DEN'
    ) {
      Modales.modalInformacion(
        Mensajes.MENSAJE_NO_INFO_CASOS_VICTIMA,
        this.dialog,
        ImagenesModal.EXCLAMACION
      );
    } else if (info) {
      this.f.numero_documento_victima.disable();
      this.f.primer_nombre_victima.setValue(info.nombreCiudadano);
      this.f.segundo_nombre_victima.setValue('');
      this.f.primer_apellido_victima.setValue(info.primerApellido);
      this.f.segundo_apellido_victima.setValue(info.segundoApellido);
      this.f.direccion_victima.setValue(info.direccion);
      this.f.telefono_victima.setValue(info.telefono);
      this.f.correo_electronico_victima.setValue(info.correoElectronico);
      this.f.direccion_victima.enable();
      this.f.telefono_victima.enable();
      this.f.correo_electronico_victima.enable();
      this.f.id_caso_asociado.enable();
      this.listaCasosAsociados = [...info.solicitudesCiudadano];
    } else if (!info && this.f.tipo_presolicitud.value !== 'DEN') {
      Modales.modalInformacion(
        Mensajes.MENSAJE_NO_INFO_VICTIMA,
        this.dialog,
        ImagenesModal.EXCLAMACION
      );
    } else {
      this.f.primer_nombre_victima.enable();
      this.f.segundo_nombre_victima.enable();
      this.f.primer_apellido_victima.enable();
      this.f.segundo_apellido_victima.enable();
      this.f.direccion_victima.enable();
      this.f.telefono_victima.enable();
      this.f.correo_electronico_victima.enable();
    }

    if (
      info &&
      info.solicitudesCiudadano.length > 0 &&
      this.f.tipo_presolicitud.value === 'DEN'
    ) {
      this.mostrarAlertaCasos = true;
    } else {
      this.mostrarAlertaCasos = false;
    }
  }

  clearInfo() {
    this.f.numero_documento.enable();
    this.f.nombre_completo.disable();
    this.f.correo_electronico.disable();
    this.f.telefono.disable();
    this.f.numero_documento.setValue('');
    this.f.nombre_completo.setValue('');
    this.f.correo_electronico.setValue('');
    this.f.telefono.setValue('');
  }

  clearInfoVictima() {
    this.f.numero_documento_victima.enable();
    this.f.primer_nombre_victima.disable();
    this.f.segundo_nombre_victima.disable();
    this.f.primer_apellido_victima.disable();
    this.f.segundo_apellido_victima.disable();
    this.f.direccion_victima.disable();
    this.f.telefono_victima.disable();
    this.f.correo_electronico_victima.disable();

    this.f.numero_documento_victima.setValue('');
    this.f.primer_nombre_victima.setValue('');
    this.f.segundo_nombre_victima.setValue('');
    this.f.primer_apellido_victima.setValue('');
    this.f.segundo_apellido_victima.setValue('');
    this.f.direccion_victima.setValue('');
    this.f.telefono_victima.setValue('');
    this.f.correo_electronico_victima.setValue('');

    this.listaCasosAsociados = [];
    this.f.id_caso_asociado.setValue(null);

  }

  cargarArchivo(base64: string) {
    if (base64) {
      this.f.archivoAdjunto.setValue(base64);
    }
  }

  changeTipoPresolicitud(e: any) {
    if (e.target.value === 'DEN') {
      this.mostrarCasos = false;
      this.f.correo_electronico.disable();
    } else {
      this.mostrarCasos = true;
      this.f.correo_electronico.enable();
    }

    this.clearInfoVictima();
  }

  guardar() {
    this.validarCampoObligatorio();

    if (this.form.valid) {
      let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

      const obj = {
        tipo_entidad_denunciante: this.f.id_tipo_entidad.value,
        tipo_documento_denunciante: this.f.id_tipo_documento.value,
        numero_documento_denunciante: this.f.numero_documento.value,
        nombres_denunciante: this.f.nombre_completo.value,
        correo_denunciante: this.f.correo_electronico.value,
        telefono_denunciante: this.f.telefono.value,
        archivoAdjunto: this.f.archivoAdjunto.value,
        descripcion_hechos: this.f.descripcion_hechos.value,
        tipoPresolicitud: this.f.tipo_presolicitud.value,
        tipo_documento_victima: this.f.id_tipo_documento_Victima.value,
        num_documento_victima: this.f.numero_documento_victima.value,
        primer_nombre_victima: this.f.primer_nombre_victima.value,
        segundo_nombre_victima: this.f.segundo_nombre_victima.value,
        primer_apellido_victima: this.f.primer_apellido_victima.value,
        segundo_apellido_victima: this.f.segundo_apellido_victima.value,
        direccion_victima: this.f.direccion_victima.value,
        telefono_victima: this.f.telefono_victima.value,
        correo_electronico_victima: this.f.correo_electronico_victima.value,
        datos_adicionales_victima: this.f.datos_adicionales_victima.value,
        idSolicitudRelacionado: this.f.id_caso_asociado.value,
        idCiudadano: (this.infoVictima && this.infoVictima?.idCiudadano) ? this.infoVictima?.idCiudadano : null,
        fecha_solicitud: date,
      };

      this.preSolicitudService.crearPresolicitud(obj).subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.modales
              .modalExito(
                `Se ha registrado la Pre-Solicitud de servicio remitida desde una entidad externa.
              El caso ha sido enviado al área legal, para la determinación de su competencia.`
              )
              .subscribe(() => {
                this.router.navigate(['/recepcion-auxiliar']);
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
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @descripcion redirige a la consulta de tareas
   */
  cancelar() {
    this.modales.modalCancelar('/recepcion-auxiliar');
  }

  /**
   * @description valida que el form sea correcto para llamar servicio de consulta
   */
  validarCampoObligatorio() {
    const { direccion_victima, telefono_victima, correo_electronico_victima } =
      this.form.value;

    if (direccion_victima || telefono_victima || correo_electronico_victima) {
      this.f.obl.setValue('ok');
    } else {
      this.f.obl.setValue(null);
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    return this.form.controls[campo].hasError('required');
  }

  /**
   * @description Solo permite ingresar numeros
   */
  public soloNumeroV(campo: string) {
    SharedFunctions.soloNumero(campo, this.form);
  }

  /**
   * @description valida que el campo cumpla la expresión regular
   * @param campo campo a validar del form
   * @returns boleano
   */
  public patternValid(campo: string): boolean {
    if (this.form.controls[campo]) {
      return this.form.controls[campo].hasError('pattern');
    } else {
      return false;
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
}
