import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CodigosPerfil,
  CodigosRespuesta,
  ImagenesModal,
  InfoRecepcionMensaje,
  Mensajes,
  MensajeSolicitudXPerfil,
} from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { RecepcionCasosInterface } from 'src/app/interfaces/recepcion-casos.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { AppState } from 'src/app/store/app.reducer';
import { Modales } from '../../../modals';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { ModalRemisionComponent } from 'src/app/pages/private/solicitud/modal-remision/modal-remision.component';

export enum UseModalRemision {
  Familia = 1,
  Externa = 2,
  Remitida = 3,
}

@Component({
  selector: 'app-recepcion-casos',
  templateUrl: './recepcion-casos.component.html',
  styleUrls: ['./recepcion-casos.component.scss'],
  providers: [DatePipe],
})
export class RecepcionCasosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public columnas: string[] = [
    'codsolicitud',
    'tipoSolicitud',
    'nombresApellidos',
    'tipoProceso',
    'numeroDocumento',
    'fechaSolicitud',
    'estado',
    'accion',
  ];

  private perfil: string = '';
  private listaCasos: RecepcionCasosInterface[] = [];

  public dataSource = new MatTableDataSource<RecepcionCasosInterface>(
    this.listaCasos
  );
  public form!: FormGroup;
  public listaTarea: DominioInterface[] = [];
  public mostrarValidaciones: boolean = false;
  public formSubmitted: boolean = false;
  public mensajeSinReg: string = '';
  public mensajeG: string = '';
  private user!: UserInterface;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private authService: AuthService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.user = this.authService.currentUserValue!;
    this.perfil = this.user.perfil!;
  }

  ngOnInit(): void {
    this.cargarForm();
    this.cargarTarea();
    this.asignarMensajeXPerfil();
    sessionStorage.removeItem('info');
  }

  /**
   * @description llena los estados a partir del state
   */
  cargarTarea() {
    this.store.select('tarea').subscribe(({ tarea }) => {
      this.listaTarea = tarea;
      this.listaTarea = this.listaTarea.filter(
        (e) => e.codigo !== 'TERMINADO' && e.codigo !== 'AJUSTAR'
      );
    });
  }

  /**
   * @description carga form
   */
  private cargarForm() {
    this.form = this.formBuilder.group({
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDocumento: '',
      codSolicitud: '',
      fecha: '',
      fechaS: '',
      estado: 'PENDIENTE',
      userID: this.authService.currentUserValue?.userID,
      codPerfil: this.perfil,
      nomO: [true, Validators.requiredTrue],
    });
  }

  /**
   * @description llama servicio consulta casos
   */
  public consultarCasos() {
    this.validarFormObligatorio();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.mostrarValidaciones = false;

      this.sharedService
        .consultarCasosPendienteDeAtencion(this.form.value)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              if (data.data.datosPaginados.length > 0) {
                this.listaCasos = data.data.datosPaginados;
                this.dataSource = new MatTableDataSource(this.listaCasos);
                this.dataSource.paginator = this.paginator;
              } else {
                this.limpiarRegistros();
              }
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
      this.formSubmitted = false;
      this.limpiarRegistros();
    }
  }

  /**
   * @description valida que esté lleno al menos un campo para poder consultar
   */
  validarFormObligatorio() {
    const { nombres, primerApellido, segundoApellido, fechaS } =
      this.form.value;

    this.form.controls['fecha'].setValue(
      this.datePipe.transform(fechaS, 'dd/MM/yyyy HH:mm:ss')
    );

    if (
      (this.form.controls['nombres'].dirty &&
        this.form.controls['nombres'].value) ||
      (this.form.controls['primerApellido'].dirty &&
        this.form.controls['primerApellido'].value) ||
      (this.form.controls['segundoApellido'].dirty &&
        this.form.controls['segundoApellido'].value)
    ) {
      if (nombres && primerApellido) {
        this.form.controls['nomO'].setValue(true);
      } else {
        this.form.controls['nomO'].setValue(false);
      }
    }

    if (
      (this.form.controls['segundoApellido'].dirty &&
        this.form.controls['segundoApellido'].value)
    ) {
      if (nombres && primerApellido && segundoApellido) {
        this.form.controls['nomO'].setValue(true);
      } else {
        this.form.controls['nomO'].setValue(false);
      }
    }
  }

  get getNombres() {
    if (this.form.get('nomO')?.hasError('required')) {
      return 'Los campos de nombre y apellidos son obligatorios';
    } else {
      return '';
    }
  }

  /**
   * @description muestra modal si desea tomar caso
   */
  modalTomarCaso(objSolicitud: RecepcionCasosInterface) {
    const estado = 'PENDIENTE';

    if (
      objSolicitud.estado.trim().toLowerCase() === estado.trim().toLowerCase()
    ) {
      Modales.modalConfirmacion(
        `El caso ${objSolicitud.codsolicitud}
      está a punto de serle asignado. ¿Está seguro que desea continuar?`,
        this.dialog,
        ImagenesModal.EXCLAMACION
      ).subscribe((res) => {
        if (res) {
          this.asignarTarea(objSolicitud);
        }
      });
    } else {
      this.dispatchTarea(objSolicitud);
    }
  }

  /**
   * @description devuelve clase según riesgo
   * @param riesgo número
   * @returns string con la clase
   */
  retornarPadreRiesgo(riesgo: number): string {
    let clase = '';

    if (riesgo === 0) {
      clase = 'box-legend__no';
    } else if (riesgo > 0 && riesgo < 20) {
      clase = 'box-legend__bajo';
    } else if (riesgo >= 20 && riesgo <= 40) {
      clase = 'box-legend__medio';
    } else {
      clase = 'box-legend__alto';
    }

    return clase;
  }

  /**
   * @description devuelve clase según riesgo
   * @param riesgo número
   * @returns string con la clase
   */
  retornarHijoRiesgo(riesgo: number): string {
    let clase = '';

    if (riesgo === 0) {
      clase = 'box-legend__no__dot';
    } else if (riesgo > 0 && riesgo < 20) {
      clase = 'box-legend__bajo__dot';
    } else if (riesgo >= 20 && riesgo <= 40) {
      clase = 'box-legend__medio__dot';
    } else {
      clase = 'box-legend__alto__dot';
    }

    return clase;
  }

  /**
   * @description llama servicio para asignar tarea al psicólogo
   */
  asignarTarea(objSolicitud: RecepcionCasosInterface) {
    const obj = {
      userID: this.user.userID,
      tareaID: objSolicitud.idTarea,
      perfilCod: this.perfil,
    };

    this.sharedService.asignarTarea(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          if (!isNaN(data.data.datosPaginados)) {
            this.dispatchTarea(objSolicitud);
          } else {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              ImagenesModal.EXCLAMACION
            );
          }
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

  /**
   *@description redirecciona al historial del ciudadano
   */
  verHistorialCiudadano(objSolicitud: RecepcionCasosInterface) {
    let redirreccion = '';
    sessionStorage.setItem('info', JSON.stringify(objSolicitud));
    if (this.perfil === 'ABO') {
      redirreccion = 'abogado';
    } else if (this.perfil === 'COM') {
      redirreccion = 'comisario';
    } else if (this.perfil === 'PSI') {
      redirreccion = 'psicologia';
    } else if (this.perfil === 'TSO') {
      redirreccion = 'trabajador-social';
    }
    this.router.navigate([`${redirreccion}/consulta-general`, objSolicitud.idSolicitud]);
  }

  /**
   * @description hace dispatch de la tarea y envía a la ruta parametrizada
   * @param objSolicitud objeto solicitud
   */
  dispatchTarea(objSolicitud: RecepcionCasosInterface) {
    if (objSolicitud.tipoSolicitud === 'PRE') {
      if (objSolicitud.path === '../abogado/firmar-cargar') {
        this.router.navigate([objSolicitud.path, objSolicitud.idSolicitud]);
      } else {
        this.router.navigate([objSolicitud.path]);
      }
    } else {
      this.router.navigate([objSolicitud.path, objSolicitud.idSolicitud]);
    }

    sessionStorage.setItem('info', JSON.stringify(objSolicitud));
  }

  /**
   * @description limpia la grilla del formulario
   */
  limpiarRegistros() {
    this.listaCasos = [];
    this.dataSource = new MatTableDataSource(this.listaCasos);
  }

  /**
   * @description asigna mensaje sin registros según perfil
   */
  asignarMensajeXPerfil() {
    switch (this.perfil) {
      case CodigosPerfil.ABOGADO:
        this.mensajeSinReg = MensajeSolicitudXPerfil.ABOGADO;
        this.mensajeG = InfoRecepcionMensaje.TITULOA;
        break;

      case CodigosPerfil.PSICOLOGO:
        this.mensajeSinReg = MensajeSolicitudXPerfil.PSICOLOGO;
        this.mensajeG = InfoRecepcionMensaje.TITULOP;
        break;

      case CodigosPerfil.COMISARIO:
        this.mensajeSinReg = MensajeSolicitudXPerfil.ABOGADO;
        this.mensajeG = InfoRecepcionMensaje.TITULOC;
        break;

      default:
        this.mensajeSinReg = MensajeSolicitudXPerfil.OTRO;
        break;
    }
  }

  /**
   * @description Abre modal en caso de que fuera traslado de comsaria
   * @param objSolicitud objeto solicitud
   */
  modalComisariaOrigen(objSolicitud: RecepcionCasosInterface) {
    this.dialog.open(ModalRemisionComponent, {
      panelClass: ['dialog-responsive', 'fondoModal'],
      width: '500px',
      height: '550px',
      data: {
        Titulo: UseModalRemision.Remitida,
        nroSolicitud: objSolicitud.idSolicitud,
        infoBrindada: "",
      },
    });
  }

  remitidoComisaria(row: RecepcionCasosInterface): boolean {
    if (row.remision === 1) {
      return true;
    }
    return false;
  }
}
