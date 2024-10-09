import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  RecepcionGenerarCargar,
  TiposDocumentoCarga,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { ReporteAbogadoPDF } from 'src/app/pages/private/abogado/report/report-pdf';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from '../../modals';

@Component({
  selector: 'app-recepcion-generar-cargar',
  templateUrl: './recepcion-generar-cargar.component.html',
})
export class RecepcionGenerarCargarComponent implements OnInit {
  public tituloFormulario: string = '';

  public archivo!: string | null;
  public objSol!: any;
  public user!: UserInterface | undefined;
  public datosIncumplimiento: any;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('info')) {
      this.objSol = JSON.parse(sessionStorage.getItem('info')!);
      this.user = this.authService.currentUserValue;
      this.tituloFormulario = RecepcionGenerarCargar.SOLICITUD_INCUMPLIMIENTO;
      this.validarCargaReporte();
    } else this.redireccionar();
  }

  /**
   * @description genera reporte según proceso en el que se encuentre
   */
  public generarReporte() {
    if (this.validarActividad()) {
      ReporteAbogadoPDF.Incumplimiento();
    } else {
      ReporteAbogadoPDF.solicitudLevantamiento();
    }
  }

  /**
   * @description valida la actividad actual del flujo
   * @returns true solicitud incumplimiento false solicitud levantamiento
   */
  private validarActividad(): boolean {
    let resultado = false;
    if (this.objSol.actividad === 'Diligenciar Solicitud de Incumplimiento.') {
      resultado = true;
    }
    return resultado;
  }

  /**
   * @description valida el reporte a generar
   */
  private validarCargaReporte() {
    if (this.validarActividad()) {
      this.reporteIncumplimiento();
    }
  }

  /**
   * @description asigna a una variable el archivo cargado
   * @param e archivo
   */
  public enviarArchivo(e: string) {
    this.archivo = e;
  }

  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar() {
    this.router.navigate(['../abogado/casos']);
  }

  /**
   * @description llama servicio que llena el reporte
   */
  private reporteIncumplimiento() {
    this.sharedService
      .reporteIncumplimiento({
        idSolicitudServicio: this.objSol.idSolicitud,
        idUsuario: this.user?.userID,
        idComisaria: this.user?.idComisaria,
      })
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.datosIncumplimiento = data.data;
        }
      });
  }

  /**
   * @description llama servicio cargar archivo
   */
  public guardarArchivo = (): Observable<boolean> => {
    let resultado = new Subject<boolean>();

    if (this.archivo && this.archivo !== '') {
      this.sharedService
        .guardarIncumplimiento(this.crearObjGuardarArchivo())
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              Modales.modalExito(
                Mensajes.MENSAJE_CARGA,
                ImagenesModal.OK,
                this.dialog
              );
              resultado.next(true);
            } else {
              Modales.modalExito(
                Mensajes.MENSAJE_CARGA_ERROR,
                ImagenesModal.EXCLAMACION,
                this.dialog
              );
              resultado.next(false);
            }
          },
        });
    } else {
      this.mensajeModalSinArchivo();
      resultado.next(false);
    }

    return resultado.asObservable();
  };

  /**
   * @description arma interfacepara guardar
   * @returns interface armada
   */
  private crearObjGuardarArchivo(): any {
    return {
      nombrearchivo: null,
      tipoDocumento: TiposDocumentoCarga.INCUMPLIMIENTO_MEDIDAS_PROTECCION,
      idSolicitudServicio: this.objSol.idSolicitud,
      entrada: this.archivo!,
      idUsuario: this.user?.userID,
      idTarea: this.objSol.idTarea,
      idComisaria: this.user?.idComisaria,
    };
  }

  /**
   * @description llama servicio guardar archivo sin más lógica
   * @returns observable
   */
  public guardarArchivoNativo = (): Observable<boolean> => {
    let resultado = new Subject<boolean>();

    if (this.archivo && this.archivo !== '') {
      this.sharedService
        .guardarIncumplimiento(this.crearObjGuardarArchivo())
        .subscribe(() => {
          resultado.next(true);
        });
    } else {
      this.mensajeModalSinArchivo();
      resultado.next(false);
    }

    return resultado.asObservable();
  };

  /**
   * @description muestra modal sin archivo
   */
  private mensajeModalSinArchivo() {
    Modales.modalInformacion(
      Mensajes.MENSAJE_SIN_ARCHIVO,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }
}
