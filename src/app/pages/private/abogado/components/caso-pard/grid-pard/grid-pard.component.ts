import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  MensajeSolicitudXPerfil,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Modales } from 'src/app/shared/modals';
import { ReporteAbogadoPDF } from '../../../report/report-pdf';
import { AbogadoService } from '../../../services/abogado.service';

@Component({
  selector: 'app-grid-pard',
  templateUrl: './grid-pard.component.html',
  styles: [],
})
export class GridPardComponent implements OnInit, OnDestroy {
  @Input() registros!: any | Subscription[];
  @Input() columnas!: any[];
  @Input() visualizarReporte: boolean = true;
  @Input() tipoReporte!: number;
  @Input() tipoDocumento!: string;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public dataSource = new MatTableDataSource<any[]>([]);
  public mensajeSinReg: string = MensajeSolicitudXPerfil.OTRO;
  public displayedColumns: string[] = [];

  private objSol!: any;
  private user!: UserInterface | undefined;
  private registroSub!: Subscription;

  constructor(
    private authService: AuthService,
    private abogadoService: AbogadoService,
    private dialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    if (this.registroSub) this.registroSub.unsubscribe();
  }

  ngOnInit(): void {
    this.validarCambiosRegistros();
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.user = this.authService.currentUserValue;
  }

  /**
   * @description arma las columnas de la grilla y asigna el datasource
   */
  private armarColumnas(): void {
    if (this.columnas) {
      this.displayedColumns = this.columnas
        .map((c) => c.key)
        .concat(['Acciones']);
    }
  }

  /**
   * @description valida si hay cambios en los registros del grid
   */
  private validarCambiosRegistros() {
    if (this.registros instanceof Subject) {
      this.registroSub = this.registros.subscribe((v) => {
        if (v) {
          this.registros = v;
          this.cargarGrid(this.registros);
        }
      });
    } else {
      this.cargarGrid(this.registros);
    }
  }

  /**
   * @description llena instancia de material grid
   */
  private cargarGrid(array: any) {
    this.armarColumnas();
    this.dataSource = new MatTableDataSource(array);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * @description llama servicio de carga archivo
   * @param entrada base64
   * @param row objeto a editar
   */
  public cargarArchivo(entrada: string, row: any): void {
    if (entrada) {
      if (this.tipoReporte === 0) {
        this.actualizarAnexoMedidasPard(entrada, row);
      } else if (this.tipoReporte === 1) {
        this.actualizarAnexoDecreto(entrada, row);
      } else {
        this.cargarNotificacionPARD(entrada, row);
      }
    }
  }

  /**
   * @description llama servicio actualizarAnexoMedidasPard
   * @param entrada base64
   * @param row objeto row
   */
  private actualizarAnexoMedidasPard(entrada: string, row: any) {
    const objPARD = this.retornarObjGrid(row);
    this.abogadoService
      .actualizarAnexoMedidasPard(this.armarObjCargaArchivo(objPARD, entrada))
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_CARGA,
              ImagenesModal.OK,
              this.dialog
            );
            this.abogadoService.emitirPARD(true);
          } else {
            this.modalError();
          }
        },
        error: () => {
          this.modalError();
        },
      });
  }

  /**
   * @description llama servicio actualizarAnexoMedidasPard
   * @param entrada base64
   * @param row objeto row
   */
  private actualizarAnexoDecreto(entrada: string, row: any) {
    const objPARD = this.retornarObjGrid(row);
    this.abogadoService
      .actualizarAnexoDecreto(this.armarObjCargaArchivo(objPARD, entrada))
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_CARGA,
              ImagenesModal.OK,
              this.dialog
            );
            this.abogadoService.emitirPARD(true);
          } else {
            this.modalError();
          }
        },
        error: () => {
          this.modalError();
        },
      });
  }

  /**
   * @description arma objeto para cargar archivo
   * @param idMedida id de la medida
   * @param entrada base64
   * @returns objeto
   */
  private armarObjCargaArchivo(objPARD: any, entrada: string): any {
    let idAnexoServicio = 0;

    if (objPARD.idAnexoPard) {
      idAnexoServicio = objPARD.idAnexoPard;
    } else if (objPARD.idAnexo) {
      idAnexoServicio = objPARD.idAnexo;
    }

    return {
      idMedida: objPARD.idMedida,
      idAnexoServicio,
      archivoDTO: {
        entrada,
        nombrearchivo: '',
        idUsuario: this.user?.userID,
        idComisaria: this.user?.idComisaria,
        tipoDocumento: this.tipoDocumento ? this.tipoDocumento : '',
        idSolicitudServicio: this.objSol.idSolicitud,
      },
    };
  }

  /**
   * @description muestra modal error
   */
  private modalError(): void {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  /**
   * @description descarga el archivo en formato pdf
   * @param row objeto de la grilla
   */
  public descargarArchivo(row: any): any {
    const obj = this.retornarObjGrid(row);

    const { idAnexoPard, idSolicitudServicio, idAnexo } = obj;
    this.obtenerDocumentoPARD(
      idAnexoPard ? idAnexoPard : idAnexo,
      idSolicitudServicio ? idSolicitudServicio : this.objSol.idSolicitud
    ).subscribe({
      next: (archivo: string) => {
        if (archivo && archivo !== '') {
          const source = `data:application/pdf;base64,${archivo}`;
          const link = document.createElement('a');
          const nombreArchivo = obj.nombreArchivo
            ? obj.nombreArchivo
            : 'reporte';
          link.href = source;
          link.download = `${nombreArchivo}.pdf`;
          link.click();
        } else {
          Modales.modalInformacion(
            'Error al descargar documento',
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        }
      },
      error: () => {
        Modales.modalInformacion(
          'Error al descargar documento',
          this.dialog,
          ImagenesModal.EXCLAMACION
        );
      },
    });
  }

  /**
   * @description obtiene el objeto por índice
   * @param row objeto a buscar
   * @returns objeto a retornar
   */
  private retornarObjGrid(row: any): any {
    return this.registros[this.dataSource.filteredData.indexOf(row)];
  }

  /**
   * @description llama servicio obtener archivo
   * @param idAnexo id del anexo
   * @returns observable con base64
   */
  private obtenerDocumentoPARD(
    idAnexo: number,
    idSolicitud: number
  ): Observable<string> {
    let subject = new Subject<string>();

    this.abogadoService.obtenerArchivoPorId(idSolicitud, idAnexo).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          subject.next(data.data);
        }
      },
    });

    return subject.asObservable();
  }

  /**
   * @description valida si se debe deshabilitar el elemento del grid
   * @param row objeto del grid
   * @returns booleano
   */
  public ocultarDescargarReporte(row: any): boolean {
    const obj = this.retornarObjGrid(row);
    let resultado = false;

    if (obj.idAnexoPard || obj.idAnexo) {
      resultado = true;
    }

    return resultado;
  }

  /**
   * @description genera reporte decreto incumplimiento
   */
  public generarReporte(): void {
    if (this.tipoReporte === 1) {
      ReporteAbogadoPDF.reportePARD('#decreto-pruebas');
    } else if (this.tipoReporte === 2) {
      ReporteAbogadoPDF.reportePARD(
        '#notificaciones-estado',
        '#tabla-notificaciones'
      );
    }
  }

  /**
   * @description arma objeto para cargar archivo
   * @param idMedida id de la medida
   * @param entrada base64
   * @returns objeto
   */
  private armarObjCargaArchivoInvolucrado(objPARD: any, entrada: string): any {
    return {
      entrada,
      nombrearchivo: '',
      tipoDocumento: this.tipoDocumento ? this.tipoDocumento : '',
      idSolicitudServicio: this.objSol.idSolicitud,
      idUsuario: this.user?.userID,
      idComisaria: this.user?.idComisaria,
      idDocumento: objPARD.idDocumento,
      idInvolucrado: objPARD.idInvolucrado,
      idAnexoNotificacionPard: objPARD.idAnexo | 0,
    };
  }

  /**
   * @description llama servicio actualizarAnexoMedidasPard
   * @param entrada base64
   * @param row objeto row
   */
  private cargarNotificacionPARD(entrada: string, row: any) {
    const objPARD = this.retornarObjGrid(row);
    this.abogadoService
      .cargarNotificacionPARD(
        this.armarObjCargaArchivoInvolucrado(objPARD, entrada)
      )
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_CARGA,
              ImagenesModal.OK,
              this.dialog
            );
            this.abogadoService.emitirPARD(true);
          } else {
            this.modalError();
          }
        },
        error: () => {
          this.modalError();
        },
      });
  }
}
