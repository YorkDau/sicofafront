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
import { SharedService } from 'src/app/services/shared.service';
import { SolicitudService } from '../../services/solicitud.service';
import { ComisariaInterface } from '../../interfaces/solicitud.interface';
import { EntidadInterface } from 'src/app/pages/private/interfaces/solicitud.interface';
import { CrearEtiquetaTareaInterface } from 'src/app/interfaces/shared.interfaces';

interface DatosFirma {
  tituloReporte: string;
  mostrarPreguntaRecurso: boolean;
  apelacion: boolean;
  esNecesarioRemitir: boolean;
  idTipoTramite: number;
  idSolPlantilla: number;
  idAnexo: number | undefined;
}
interface ArchivoTraslado {
  entrada: string;
  tipoDocumento: string;
  Nombrearchivo:string;
}
@Component({
  selector: 'app-imprimir-firmar-cargar',
  templateUrl: './imprimir-firmar-cargar.component.html',
  styleUrls: ['./imprimir-firmar-cargar.component.scss'],
})
export class ImprimirFirmarCargarComponent implements OnInit, OnDestroy {
  private objSol!: any;
  private user!: UserInterface | undefined;
  public archivo!: string | null;
  public archivosTraslados: ArchivoTraslado[] = [];
  public archivoRemision!: string | null;

  public radioPregunta: boolean = false;
  public datosFirma!: DatosFirma;
  public delete: boolean = true;
  public nuevoArchivo: boolean = true;
  public nuevoArchivoOficioTraslado: boolean = true;
  public nuevoArchivoRemision: boolean = true;
  public selectComisaria: ComisariaInterface[] = [];
  public selectEntidad: EntidadInterface[] = [];
  public comisariaSeleccionada: number | null = null;
  public idEntidadTraslado: number | null = null;
  

  constructor(
    private autoService: AutoService,
    private router: Router,
    private solicitudService: SolicitudService,
    private dialog: MatDialog,
    private modales: Modales,
    private abogadoService: AbogadoService,
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    this.cargaSelectComisaria();
    this.cargaSelectEntidad();
  }

  ngOnDestroy(): void {
    this.autoService.emitirAuto(null);
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('info')) {
      this.objSol = JSON.parse(sessionStorage.getItem('info')!);
      setTimeout(() => {
        this.objSol = JSON.parse(sessionStorage.getItem('info')!);
      }, 500);

      // console.log('objSol', this.objSol);
      this.user = this.authService.currentUserValue;
      this.cargarListadoSecciones();
    } else this.redireccionar();
  }

  /**
   * @description carga el select de comisaria
   */
  private cargaSelectComisaria() {
    const idComisaria = this.authService.currentUserValue?.idComisaria;
    // console.log('idComisaria', idComisaria);
    this.solicitudService
      .getComisariaTraslado(idComisaria)
      .subscribe((comisaria) => {
        if (comisaria.statusCode === CodigosRespuesta.OK) {
          this.selectComisaria = comisaria.data;
          // console.log('comisarias', this.selectComisaria);
        }
      });
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
    // console.log('DATA AUTO', data); 
    // console.log('this.objSol', this.objSol);
    this.datosFirma = {
      tituloReporte: data.nombrePlantilla,
      mostrarPreguntaRecurso: data.tieneApelacion === 1 ? true : false,
      apelacion: data.apelacion,
      esNecesarioRemitir: data.esNecesarioRemitir,
      idTipoTramite: this.objSol.idTipoTramite,
      idSolPlantilla: data.idSolPlantilla,
      idAnexo: data.idAnexo ? data.idAnexo : 0,
    };

    if (this.objSol.es_necesario_remitir && this.esAdultoMayor()) {
      this.datosFirma.esNecesarioRemitir = this.objSol.es_necesario_remitir;
    }
    
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
  public descargarDocumentoOficioTraslado(formato = null): void {
    const nombre: string = formato ||'FORMATO TRASLADO CASO.pdf';

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
    public enviarArchivoOficioTraslado(archivo: string, tipo:string): void {
      let record = this.archivosTraslados.find(x => x.tipoDocumento == tipo)
      if (archivo && archivo === '') {
        this.nuevoArchivoOficioTraslado = true;
      }
      if (!record) {
        if (archivo && archivo !== '') {
          this.archivosTraslados.push({tipoDocumento:tipo, entrada:archivo, Nombrearchivo:''}) 
          // console.log(this.archivosTraslados)
        }
      } else {
        record.entrada = '';
      }
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
  public descargarDocumentoRemision(): void {
    const nombre: string = 'AUTO QUE ADMITE Y REMITE A OTRA COMISARIA.pdf';

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
  public enviarArchivoRemision(archivoRemision: string): void {
    if (archivoRemision && archivoRemision !== '') {
      this.archivoRemision = archivoRemision;
    } else {
      this.archivoRemision = '';
      this.nuevoArchivoRemision = true;
    }
    // console.log(archivoRemision);
    // console.log(this.archivoRemision);
  }

  /**
   * @description crea objeto para cerrar la actuación
   * @returns objeto para cerrar la actuación
   */
  private crearObjCerrarActuacion(): any {
    let datos = {
      tareaID: this.objSol.idTarea,
      userID: this.user?.userID,
      perfilCod: this.user?.perfil,
      valorEtiqueta: this.datosFirma.apelacion ? '1' : '0',
      idSolicitudServicio: this.objSol.idSolicitud,
      idUsuario: this.user?.userID,
      idComisaria: this.user?.idComisaria,
      idComisariaTraslado: this.comisariaSeleccionada,
      idEntidadTraslado:this.idEntidadTraslado,
    };
    // Agregado para cerrar solicitud en 
    if (this.idEntidadTraslado && this.esAdultoMayor()) {
      datos.valorEtiqueta = '1'; 
    }
    return datos;
  }
  private crearObjEtiqueta(): CrearEtiquetaTareaInterface {
    const obj: CrearEtiquetaTareaInterface = {
        valorEtiqueta: this.datosFirma.apelacion ? '1' : '0',
        idsolicitudServicio: this.objSol.idSolicitud,
        idtarea: this.objSol.idTarea,
    }
    // Agregado para cerrar solicitud en 
    if (this.idEntidadTraslado && this.esAdultoMayor()) {
      obj.valorEtiqueta = '1'; 
    } else if (this.esAdultoMayor()) {
      obj.valorEtiqueta = '0'; 
    }
    return obj;
  }

  crearEtiqueta() {
      this.sharedService.crearEtiqueta(this.crearObjEtiqueta()).subscribe({
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
    let obj = {
      entrada: this.archivo ? this.archivo : '',
      archivoRemision:this.archivoRemision,
      nombrearchivo: '',
      tipoDocumento: TiposDocumentoCarga.AUTO_MEDIDAS_PROTECCION,
      idSolicitudServicio: this.objSol.idSolicitud,
      idUsuario: this.user?.userID,
      idComisaria: this.user?.idComisaria,
      idComisariaTraslado: this.comisariaSeleccionada,
      idEntidadTraslado:this.idEntidadTraslado,
      archivosTraslados:this.archivosTraslados
    };
    if (this.esAdultoMayor() && this.archivoRemision && !obj.entrada) {
      obj.entrada = this.archivoRemision;
      obj.nombrearchivo = "Constancia Traslado"
    }
    return obj;
  }
  onChangeComisaria() {
    this.comisariaSeleccionada;
  }

  /**
   * @description llama servicio que adjunta el archivo
   * @param cierre cerrar actuación, false no
   */
  public cargarAdjuntoFirma(cierre: boolean): void {
    if (this.archivo && this.archivo !== '' || this.esAdultoMayor()) {
      if (this.nuevoArchivo) {
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
              this.crearEtiqueta()
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
  
  esAdultoMayor() {
    return this.objSol.tipoProceso.indexOf("Adulto Mayor") > -1
  }
}
