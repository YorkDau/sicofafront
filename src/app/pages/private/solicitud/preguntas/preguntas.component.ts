import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as validaciones from 'src/app/pages/private/solicitud/preguntas/validators';
import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import { ModalRemisionComponent } from '../modal-remision/modal-remision.component';
import { MatDialog } from '@angular/material/dialog';
import * as interfaces from 'src/app/pages/private/interfaces/ciudadano.interface';
import { Router } from '@angular/router';
import { ResponseInterface } from '../../../../interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SharedService } from 'src/app/services/shared.service';
import { SolicitudCiudadanoInterface } from '../../interfaces/solicitud.interface';
import { SolicitudService } from '../services/solicitud.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

export enum UseModalRemision {
  Familia = 1,
  Externa = 2,
}
@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss'],
})
export class PreguntasComponent implements OnInit, OnChanges {
  @Output() passTap2 = new EventEmitter<number>();
  @Input() idSolicitud!: number;
  public myForm!: FormGroup;
  public minDate!: Date;
  public maxDate!: Date;
  public mostrarValidaciones: boolean = false;
  public cComisariaFamilia: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public selectRelacion: interfaces.DominioInterface[] = [];
  public selectTipo_Tramite: interfaces.DominioInterface[] = [];
  public selectContextoFamiliar: interfaces.DominioInterface[] = [];
  public id_ciudadano!: number;
  public fechaActual: Date = new Date();
  public entidad!: number;
  public comisaria!: number;
  public justificacion!: string;
  public mostrarMensajeDias: boolean = false;
  public validaGuardarOactualizar: boolean = true;
  private user!: UserInterface;

  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog,
    private sharedService: SharedService,
    private solicitudService: SolicitudService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSolicitud'] && this.idSolicitud > 0) {
      this.obtenerSolicitudDetalle();
      this.validaGuardarOactualizar = false;
      //consultar respuestas de la solicitud
    }
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue!;
    if (sessionStorage.getItem('ciudadano')) {
      const ciudadano = JSON.parse(sessionStorage.getItem('ciudadano')!);
      this.id_ciudadano = ciudadano.idCiudadano;
    }

    this.valoresMaxMinDatePicker();
    this.cargarForm();
    this.habilitarCampos();
    this.cargaSelectRelacion();
    this.cargaSelectTramite();
    this.cargaSelectContexto();

    this.myForm
      .get('esCompetenciaComisaria')
      ?.valueChanges.subscribe((resp) => {
        this.myForm.get('noCompetenciaDescripcion')?.setValue('');
        this.myForm.get('esNecesarioRemitir')?.setValue('no');
        this.myForm.get('idtipoTramite')?.setValue('');
        this.myForm.get('idContextofamiliar')?.setValue('');
      });
  }

  /**
   * @description establece los valores de maximo y minimo en los datepicker
   */
  private valoresMaxMinDatePicker() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 10, 0, 1);
    this.maxDate = new Date(
      currentYear,
      new Date().getMonth(),
      new Date().getDate()
    );
  }

  /**
   * @description carga formulario
   */
  public cargarForm(): void {
    this.myForm = this.fb.group(
      {
        fechaSolicitud: ['', [Validators.required]],
        horaSolicitud: [
          this.fechaActual.toLocaleTimeString(),
          [Validators.required],
        ],
        fechaHechoViolento: ['', [Validators.required]],
        descripcionHechos: ['', [Validators.required]],
        esVictima: ['no', [Validators.required]],
        relacionParentescoAgresor: ['', [Validators.required]],
        conviveConAgresor: ['no', [Validators.required]],
        esCompetenciaComisaria: ['no', [Validators.required]],
        idtipoTramite: '',
        idContextofamiliar: '',
        esNecesarioRemitir: 'no',
        noCompetenciaDescripcion: '',
      },
      {
        validators: [
          validaciones.validarClasifiqueTramite,
          validaciones.validarContextoFamiliar,
          validaciones.validarJustifique,
        ],
      }
    );

    this.myForm.get('fechaSolicitud')?.disable();
    this.myForm.controls['fechaSolicitud'].setValue(
      `${new Date().toLocaleDateString()}`
    );
    this.myForm.get('horaSolicitud')?.disable();
  }

  /**
   * @description envia informacion al contenedor padre
   */
  public functionPassTap2() {
    this.passTap2.emit(1);
  }

  /**
   * @description carga el select de Tipo Relacion
   */
  private cargaSelectRelacion() {
    this.sharedService
      .getDominio('Tipo_Relacion')
      .subscribe((tipo_Relacion: ResponseInterface) => {
        if (tipo_Relacion.statusCode === CodigosRespuesta.OK) {
          this.selectRelacion = tipo_Relacion.data;
        }
      });
  }

    /**
   * @description carga valores de retomar
   */
    private obtenerSolicitudDetalle() {
      this.sharedService
        .ObtenerSolicitudDetalle(this.idSolicitud)
        .subscribe((resp) => {
            this.myForm.controls['fechaSolicitud'].setValue(resp.data.fecha_solicitud);
            this.myForm.controls['horaSolicitud'].setValue(resp.data.hora_solicitud);
            this.myForm.controls['descripcionHechos'].setValue(resp.data.descripcion_de_hechos);
            this.myForm.controls['esVictima'].setValue(resp.data.es_victima == true ? 'si' : 'no');
            this.myForm.controls['relacionParentescoAgresor'].setValue(resp.data.relacionParentescoAgresor);
            this.myForm.controls['conviveConAgresor'].setValue(resp.data.conviveConAgresor == true ? 'si' : 'no');
            this.myForm.controls['esCompetenciaComisaria'].setValue(resp.data.esCompetenciaComisaria == true ? 'si' : 'no');
            this.myForm.controls['idtipoTramite'].setValue(resp.data.idtipoTramite);
            this.myForm.controls['idContextofamiliar'].setValue(resp.data.idContextofamiliar);
            this.myForm.controls['esNecesarioRemitir'].setValue(resp.data.esNecesarioRemitir == true ? 'si' : 'no');
            this.myForm.controls['noCompetenciaDescripcion'].setValue(resp.data.noCompetenciaDescripcion);
        });
    }
  
  /**
   * @description carga el select de Tipo Relacion
   */
  private cargaSelectTramite() {
    this.sharedService
      .getDominio('Tipo_Tramite')
      .subscribe((tipo_Tramite: ResponseInterface) => {
        if (tipo_Tramite.statusCode === CodigosRespuesta.OK) {
          this.selectTipo_Tramite = tipo_Tramite.data;
        }
      });
  }

  /**
   * @description carga el select de Tipo Relacion
   */
  private cargaSelectContexto() {
    this.sharedService
      .getDominio('Contexto_Familiar')
      .subscribe((contexto_Familiar: ResponseInterface) => {
        if (contexto_Familiar.statusCode === CodigosRespuesta.OK) {
          this.selectContextoFamiliar = contexto_Familiar.data;
        }
      });
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    const fechaSeleccionada = event.target.value as Date;
    var diaEnMils = 1000 * 60 * 60 * 24;
    var resultado = Math.round(
      (new Date().getTime() - fechaSeleccionada.getTime()) / diaEnMils
    );
    this.mostrarMensajeDias = false;
    this.mostrarMensajeDias = resultado > 30;
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    return this.myForm.controls[campo].hasError('required');
  }

  /**
   * @description campo Clasifique el tramite es requerido cuando el radio de competencia de comisaria de familia esta marcado en si
   * hace validacion personal en validators.ts
   */
  public isRequiredClasifiqueTramite(): boolean {
    return this.myForm.hasError('requiredTramite');
  }

  /**
   * @description campo Contexto Familiar es requerido cuando el radio de competencia de comisaria de familia esta marcado en si
   * hace validacion personal en validators.ts
   */
  public isRequiredContextoFamiliar(): boolean {
    return this.myForm.hasError('requiredContextoFamiliar');
  }

  /**
   * @description campo Justifique es requerido cuando el radio de competencia de comisaria de familia esta marcado en no
   * hace validacion personal en validators.ts
   */
  public isRequiredJustifique(): boolean {
    return this.myForm.hasError('requiredJustifique');
  }

  /**
   * @description habilita los campos correspondientes a comisaria de familia si marcan, si
   */
  public habilitarCampos() {
    this.myForm
      .get('esCompetenciaComisaria')
      ?.valueChanges.subscribe((resp) => {
        if (resp === 'si') {
          this.cComisariaFamilia = true;
        } else {
          this.cComisariaFamilia = false;
        }
      });
  }

  /**
   * @description para registrar datos generales y pasar a la pestaña de datos
   * involucrados si seleccionan "si" en competencia de comisaria de familia
   */
  public registrar(): void {
    this.mostrarValidaciones = false;

    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      /* todo ok*/

      if (this.myForm.get('esCompetenciaComisaria')?.value == 'si') {
        if (this.myForm.get('esNecesarioRemitir')?.value == 'si') {
          const dialogRef = this._dialog.open(ModalRemisionComponent, {
            panelClass: ['dialog-responsive', 'fondoModal'],
            disableClose: true,
            width: '500px',
            height: '550px',
            data: {
              Titulo: UseModalRemision.Familia,
              nroSolicitud: '',
              infoBrindada: this.myForm.get('descripcionHechos')?.value,
            },
          });

          dialogRef.afterClosed().subscribe((resp) => {
            if (resp.respuesta === true) {
              if (resp.comisaria) {
                this.comisaria = resp.comisaria;
              }
              if (resp.justificacion) {
                this.justificacion = resp.justificacion;
              }
              this.guardar(false);
              this.functionPassTap2();
            }
          });
        } else {
          this.guardar(false);
          this.functionPassTap2();
        }
      } else {
        /** guarda y abre HU7 enitdad externa */
        const dialogRef = this._dialog.open(ModalRemisionComponent, {
          panelClass: ['dialog-responsive', 'fondoModal'],
          disableClose: true,
          width: '500px',
          height: '550px',
          data: {
            Titulo: UseModalRemision.Externa,
            nroSolicitud: '',
            infoBrindada: this.myForm.get('descripcionHechos')?.value,
          },
        });

        dialogRef.afterClosed().subscribe((resp) => {
          if (resp.respuesta === true) {
            if (resp.entidad) {
              this.entidad = resp.entidad;
            }
            if (resp.justificacion) {
              this.justificacion = resp.justificacion;
            }
            this.guardar(true);
            this.router.navigate(['/historial-ciudadano', this.id_ciudadano]);
          }
        });
      }
    }
  }

  /**
   * @description guarda
   * @param mostrarMensaje muestra el mesaje cuando se crea la solicitud
   */
  private guardar(mostrarMensaje: boolean) {
    if(this.validaGuardarOactualizar){
      this.solicitudService.crearSolicitudCiudadano(this.getDataPost).subscribe({
        next: (resp: ResponseInterface) => {
          if (resp.statusCode === CodigosRespuesta.OK) {
            sessionStorage.setItem('idC', resp.data);
            if (mostrarMensaje) {
              this.modalInfo(false);
            }
          }
        },
        error: () => {
          this.modalInfo(true);
        },
      });
    }else {
      this.solicitudService.actualizarSolicitudCiudadano(this.getDataPost).subscribe({
        next: (resp: ResponseInterface) => {
          if (resp.statusCode === CodigosRespuesta.OK) {
            sessionStorage.setItem('idC', resp.data);
            if (mostrarMensaje) {
              this.modalInfo(false);
            }
          }
        },
        error: () => {
          this.modalInfo(true);
        },
      });
    }

  }

  private modalInfo(error: boolean) {
    if (error) {
      Modales.modalExito(
        Mensajes.MENSAJE_ERROR,
        'assets/images/exclamacion.svg',
        this._dialog
      );
    } else {
      Modales.modalExito(
        Mensajes.MENSAJE_SOL_EXITO,
        'assets/images/check.svg',
        this._dialog
      );
    }
  }

  private get getDataPost(): SolicitudCiudadanoInterface {
    return {
      idCiudadano: this.id_ciudadano,
      idComisaria: this.user.idComisaria,
      fechaSolicitud: this.datePipe.transform(
        this.fechaActual,
        'dd/MM/yyyy HH:mm:ss'
      )!,
      horaSolicitud: this.datePipe.transform(
        this.fechaActual,
        'dd/MM/yyyy HH:mm:ss'
      )!,
      fechaHechoViolento: this.datePipe.transform(
        this.myForm.get('fechaHechoViolento')?.value,
        'dd/MM/yyyy HH:mm:ss'
      )!,
      descripcionHechos: this.myForm.get('descripcionHechos')?.value,
      esVictima: this.myForm.get('esVictima')?.value == 'si' ? true : false,
      conviveConAgresor:
        this.myForm.get('conviveConAgresor')?.value == 'si' ? true : false,
      relacionParentescoAgresor: this.myForm.get('relacionParentescoAgresor')
        ?.value,
      esCompetenciaComisaria:
        this.myForm.get('esCompetenciaComisaria')?.value == 'si' ? true : false,
      noCompetenciaDescripcion: this.myForm.get('noCompetenciaDescripcion')
        ?.value,
      idtipoTramite:
        this.myForm.get('idtipoTramite')?.value == ''
          ? 0
          : this.myForm.get('idtipoTramite')?.value,
      idContextofamiliar:
        this.myForm.get('idContextofamiliar')?.value == ''
          ? 0
          : this.myForm.get('idContextofamiliar')?.value,
      esNecesarioRemitir:
        this.myForm.get('esNecesarioRemitir')?.value == 'si' ? true : false,
      idEntidadExterna: this.entidad,
      idComisariaRemision: this.comisaria,
      justificacionRemision: this.justificacion,
      idUsuarioSistema: this.user.userID,
      idSolicitud: this.idSolicitud
    };
  }
}
