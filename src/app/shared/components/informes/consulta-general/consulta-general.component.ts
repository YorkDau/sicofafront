import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosPerfil, CodigosRespuesta, ImagenesModal, InfoRecepcionMensaje, Mensajes, MensajeSolicitudXPerfil } from 'src/app/constants';

import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { RecepcionCasosInterface } from 'src/app/interfaces/recepcion-casos.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { AppState } from 'src/app/store/app.reducer';
import { Modales } from '../../../modals';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { ModalRemisionComponent } from 'src/app/pages/private/solicitud/modal-remision/modal-remision.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalPresolicitudesComponent } from '../modal-presolicitudes/modal-presolicitudes.component';
export enum UseModalRemision {
  Familia = 1,
  Externa = 2,
  Remitida = 3,
}


@Component({
  selector: 'app-consulta-general',
  templateUrl: './consulta-general.component.html',
  styleUrls: ['./consulta-general.component.scss'],
  providers: [DatePipe],
})
export class ConsultaComisariaGeneralComponent implements OnInit {

@ViewChild(MatPaginator) paginator!: MatPaginator;

public columnas: string[] = [
  'codigoSolicitud',
  'nombreCiudadano', 
  'tipoDocumento',         
  'numeroDocumento', 
  'fechaSolicitud',         
  'estadoSolicitud', 
  'proceso'
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
    private router: Router
  ) {
    this.user = this.authService.currentUserValue!;
    this.perfil = this.user.perfil!;
  }

  ngOnInit(): void {
    this.cargarForm();
    this.asignarMensajeXPerfil();
    sessionStorage.removeItem('info');
  }


  /**
   * @description carga form
   */
  private cargarForm() {
    this.form = this.formBuilder.group({
      numeroDocumento: '',
      codigoSolicitud: '',
      idComisaria: this.authService.currentUserValue?.idComisaria,
      nomO: [true, Validators.requiredTrue],
    });
  }
  public abrirModalPresolicitudesConsulta() {
    const dialogRef = this.dialog.open(ModalPresolicitudesComponent, {
      panelClass: ['roundedModal', 'custom-presolicitudes-modal'],
      disableClose: true,
      width: '1400px',
      height: '95vh', // Cambiado a viewport height
      maxHeight: '95vh',
      autoFocus: false
    });
    
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp === true) {
        //this.consultarCasos();
      }
    });
  }
  /**
   * @description llama servicio consulta general solcitudes
   */
  public coonsultarSolicitudesGeneralesFiltro() {
    this.validarFormObligatorio();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.mostrarValidaciones = false;

      this.sharedService
        .consultaSolicitudesGenerales(this.form.value)
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
  validarFormObligatorio() {
    const { nombres, primerApellido, segundoApellido, fechaS } =
      this.form.value;
  }
  verHistorialCiudadano(objSolicitud: any) {
    console.log(objSolicitud)
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
    console.log(redirreccion)
    this.router.navigate([`${redirreccion}/observacion/apelaciones`, objSolicitud.id_solicitud_servicio]);
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

