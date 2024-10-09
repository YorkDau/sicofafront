import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  TiposDocumentoCarga,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Modales } from 'src/app/shared/modals';
import { ReporteAbogadoPDF } from '../report/report-pdf';
import { AbogadoService } from '../services/abogado.service';
import { AutoService } from '../services/auto.service';

interface DatosFirma {
  tituloReporte: string;
  mostrarPreguntaRecurso: boolean;
  apelacion: boolean;
  idSolPlantilla: number;
  idAnexo: number | undefined;
}
@Component({
  selector: 'app-imprimir-firmar-cargar',
  templateUrl: './imprimir-firmar-cargar.component.html',
  styleUrls: ['./imprimir-firmar-cargar.component.scss'],
})
export class ImprimirFirmarCargarComponent implements OnInit, OnDestroy {
  private objSol!: any;
  private user!: UserInterface | undefined;
  private archivo!: string | null;

  public radioPregunta: boolean = false;
  public datosFirma!: DatosFirma;
  public delete: boolean = true;
  public nuevoArchivo: boolean = true;

  constructor(
    private autoService: AutoService,
    private router: Router,
    private dialog: MatDialog,
    private modales: Modales,
    private abogadoService: AbogadoService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.autoService.emitirAuto(null);
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('info')) {
      this.objSol = JSON.parse(sessionStorage.getItem('info')!);
      this.user = this.authService.currentUserValue;
      this.cargarListadoSecciones();
    } else this.redireccionar();
  }

  /**
   * @description carga el auto para mostrar el reporte
   */
  private cargarListadoSecciones(): void {
    this.autoService.obtenerSecciones(this.objSol.idSolicitud).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.autoService.emitirArregloSecciones(data.data.secciones);
          this.llenarInterfaceDatosFirma(data.data);
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
   * @description llena la interfaz de datos firma
   * @param data respuesta servicio auto
   */
  private llenarInterfaceDatosFirma(data: any): void {
    this.datosFirma = {
      tituloReporte: data.nombrePlantilla,
      mostrarPreguntaRecurso: data.tieneApelacion === 1 ? true : false,
      apelacion: data.apelacion,
      idSolPlantilla: data.idSolPlantilla,
      idAnexo: data.idAnexo ? data.idAnexo : 0,
    };
    this.radioPregunta = data.apelacion;
    this.archivo = data.idAnexo;
    this.nuevoArchivo = data.idAnexo ? false : true;
  }

  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar(): void {
    this.router.navigate(['../abogado/casos']);
  }

  /**
   * @description genera el reporte a partir de las secciones seleccionadas
   */
  public generarReporte(): void {
    ReporteAbogadoPDF.generarAuto();
  }

  /**
   * @description muestra modal de cancelar solicitud
   */
  public cancelar(): void {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_SOL,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) {
        this.redireccionar();
      }
    });
  }

  /**
   * @description muestra modal error
   */
  private msgError(): void {
    this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
  }

  /**
   * @description asigna valor base64 del archivo cargado
   * @param archivo string base64
   */
  public enviarArchivo(archivo: string): void {
    if (archivo && archivo !== '') {
      this.archivo = archivo;
    } else {
      this.archivo = '';
      this.nuevoArchivo = true;
    }
  }

  /**
   * @description crea objeto para cerrar la actuación
   * @returns objeto para cerrar la actuación
   */
  private crearObjCerrarActuacion(): any {
    return {
      tareaID: this.objSol.idTarea,
      userID: this.user?.userID,
      perfilCod: this.user?.perfil,
      valorEtiqueta: this.datosFirma.apelacion ? '1' : '0',
    };
  }

  /**
   * @description llama servicio cerrar actuación
   */
  private cerrarActuacion(): void {
    this.abogadoService
      .cerrarActuacion(this.crearObjCerrarActuacion())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_CERRAR_SOLICITUD,
              ImagenesModal.OK,
              this.dialog
            );
            this.redireccionar();
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
   * @description crea objeto para guardar archivo
   * @returns objeto para guardar archivo
   */
  private crearObjGuardarAdjunto(): any {
    return {
      entrada: this.archivo,
      nombrearchivo: '',
      tipoDocumento: TiposDocumentoCarga.AUTO_MEDIDAS_PROTECCION,
      idSolicitudServicio: this.objSol.idSolicitud,
      idUsuario: this.user?.userID,
      idComisaria: this.user?.idComisaria,
    };
  }

  /**
   * @description llama servicio que adjunta el archivo
   * @param cierre cerrar actuación, false no
   */
  public cargarAdjuntoFirma(cierre: boolean): void {
    if (this.archivo && this.archivo !== '') {
      if(this.nuevoArchivo) {
        this.abogadoService
        .cargarAdjuntoFirma(this.crearObjGuardarAdjunto())
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.datosFirma.idAnexo = data.data;
              this.firmarPlantilla(cierre);
            } else {
              this.msgError();
            }
          },
          error: () => {
            this.msgError();
          },
        });
      } else {
        this.firmarPlantilla(cierre);
      }
      
    } else {
      this.mensajeModalSinArchivo();
    }
  }

  /**
   * @description crea objeto para firmar la plantilla
   * @param cierre indica si se cierra o no la actuación
   * @param idAnexo id del anexo
   * @returns objeto a insertar
   */
  private crearObjFirmarPlantilla(cierre: boolean): any {
    return {
      idSolPlantilla: this.datosFirma.idSolPlantilla,
      apelacion: this.datosFirma.apelacion,
      idAnexo: this.datosFirma.idAnexo,
      cierre,
    };
  }

  /**
   * @description llama servicio firmar plantilla
   * @param cierre true cerrar actuación, false no
   */
  private firmarPlantilla(cierre: boolean): void {
    this.abogadoService
      .firmarPlantilla(this.crearObjFirmarPlantilla(cierre))
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (cierre) {
              this.cerrarActuacion();
            } else {
              Modales.modalExito(
                Mensajes.MENSAJE_OK,
                ImagenesModal.OK,
                this.dialog
              );
            }
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
   * @description llena interface para obtener el archivo cargado si existe
   * @returns objeto para obtener el archivo
   */
  public llenarInterfaceArchivoExistente(): ArchivoInterface {
    return {
      idArchivo: this.datosFirma.idAnexo,
      idSolicitud: this.objSol.idSolicitud,
    };
  }

  /**
   * @description muestra modal sin archivo
   */
  private mensajeModalSinArchivo(): void {
    Modales.modalInformacion(
      Mensajes.MENSAJE_SIN_ARCHIVO,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  /**
   * @description cambia el valor de la variable radioPregunta según selección
   * @param valor valor del radio button
   */
  public cambioRadio(valor: string): void {
    this.radioPregunta = valor === 'Si' ? true : false;
    this.datosFirma.apelacion = valor === 'Si' ? true : false;
  }

  /**
   * @description muestra modal cerrar actuación
   */
  public modalConfirmaCerrarActuacion() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.cargarAdjuntoFirma(true);
    });
  }
}
