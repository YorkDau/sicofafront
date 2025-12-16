import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Store } from '@ngrx/store';
import {
  CodigosRespuesta,
  Mensajes,
  ImagenesModal
} from 'src/app/constants';

import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { EntidadInterface } from 'src/app/pages/private/interfaces/solicitud.interface';
import { CrearEtiquetaTareaInterface } from 'src/app/interfaces/shared.interfaces';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';
import { SolicitudService } from 'src/app/pages/private/services/solicitud.service';
import { SharedService } from '../../../services/shared.service';
import { ComisarioService } from 'src/app/pages/private/comisario/administracion/services/comisario.service';
import { TomaDecisionInformacionInterface } from 'src/app/pages/private/comisario/administracion/interfaces/toma-decision.interface';
import { SidenavComponent } from 'src/app/shared/components/general/sidenav/sidenav.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RecepcionCasosInterface } from '../../../interfaces/recepcion-casos.interface';
import { ReporteAbogadoPDF } from 'src/app/pages/private/abogado/report/report-pdf';


@Component({
  selector: 'app-tomar-decision-informacion',
  templateUrl: './tomar-decision-informacion.component.html',
  styleUrls: ['./tomar-decision-informacion.component.scss'],
})
export class TomarDecisionInformacionComponent implements OnInit {
  
  public tarea: RecepcionCasosInterface = JSON.parse(
    sessionStorage.getItem('info')!
  );
  

    public observacionCierre: string = '';
    
    public mostrarObservaciones: boolean = false; // por defecto en "NO"
    public cierre: boolean = false;

  public esNecesarioRemitir?: boolean = false;
  public observaciones: string = '';
  public selectEntidad: EntidadInterface[] = [];
  
  private autoCierre: string = '';
  

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;

  public iFile: ArchivoInterface = {};

  public user!: UserInterface | undefined;

  constructor(
    private store: Store<AppState>,
    private config: NgSelectConfig,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private modales: Modales,
    private solicitudService: SolicitudService,
    private sharedService: SharedService,
    private comisarioService: ComisarioService,
    private authService: AuthService,
    private router: Router,
    private _dialog: MatDialog,
  ) {
    this.config.notFoundText = 'No se encontraron coincidencias';
  }

  ngOnInit(): void {
    this.cargaSelectEntidad();
    this.user = this.authService.currentUserValue;
    console.log(this.tarea)
  }


  cargarArchivoAutoCierre(base64: string) {
    if (base64) {
      this.autoCierre = base64;
    }
  }
  


  /**
   * @descripcion redirige a la consulta de tareas
   */
  cancelar() {
    // const ruta = this.tarea.pathRetorno ? this.tarea.pathRetorno : undefined;
    // this.modales.modalCancelar(ruta);
    console.log("CANCELAR")
    this.modales.modalCancelar('/comisario/casos');
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
   * @descripcion cierra las actuaciones
   */
  cerrarActuaciones(crearEtiqueta: boolean = false) {
    this.modales.modalCerrarActuaciones(
      this.tarea,
      undefined,
      this.cierre ? '1' : '0'
    );
  }

  modalConfirmaCerrarActuacion() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.guardar(true);
    });
  }

  crearEtiqueta() {
    const obj: CrearEtiquetaTareaInterface = {
      valorEtiqueta: this.cierre ? '1' : '0',
      idsolicitudServicio: this.tarea.idSolicitud,
      idtarea: this.tarea.idTarea,
    };
    this.sharedService.crearEtiqueta(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data && data.statusCode === CodigosRespuesta.OK) {
          this.cerrarActuacion();
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

  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }

  guardar(cerrar: boolean = false) {
    this.comisarioService.postTomarDecisionInformacion(this.getObjGuardar()).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          if (cerrar) {
            this.crearEtiqueta();
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
  }

  getObjGuardar(): TomaDecisionInformacionInterface {
    return {
      idSolicitudServicio:this.tarea.idSolicitud,
      cierre:this.cierre,
      esNecesarioRemitir:this.esNecesarioRemitir,
      autoCierre:this.autoCierre,
      observaciones:this.observaciones
    };
  }

  cerrarActuacion() {
    this.sharedService
      .cerrarActuaciones({
        tareaID: this.tarea.idTarea,
        perfilCod: this.user?.perfil!,
        userID: this.user?.userID!,
        valorEtiqueta: this.cierre ? '1' : '0',
      })
      .subscribe((cerrar) => {
        if (cerrar && cerrar.statusCode == 200) {
          sessionStorage.removeItem('info');
          let navigate = SidenavComponent.getRutaPerfil(this.user?.perfil!)[0]
            .ruta!;
          this.router.navigate([navigate]);
        } else {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        }
      });
  }

  radioConcilacion(){
    this.esNecesarioRemitir = this.cierre ? false : undefined;
  }
  cierreDDFF(){
    this.autoCierre = '';
    this.observaciones = '';
  }
  
  /**
   * @description genera el reporte a partir de las secciones seleccionadas
   */
  public generarReporte(): void {
    ReporteAbogadoPDF.generarAuto();
  }
  
}
