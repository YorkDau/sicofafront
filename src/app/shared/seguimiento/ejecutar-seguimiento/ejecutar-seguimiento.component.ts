import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TablaRemisiones } from 'src/app/pages/private/interfaces/remision.interface';
import { SharedService } from 'src/app/services/shared.service';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  CodigosRespuesta,
  ImagenesModal,
  LIMITE_CARGA,
  Mensajes,
} from 'src/app/constants';
import { Modales } from '../../modals';
import { MatDialog } from '@angular/material/dialog';
import { EditarArvhivoRemision } from 'src/app/pages/private/interfaces/tipo-remision.interface';
import { RecepcionCasosInterface } from 'src/app/interfaces/recepcion-casos.interface';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-ejecutar-seguimiento',
  templateUrl: './ejecutar-seguimiento.component.html',
})
export class EjecutarSeguimientoComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['tipoFormato', 'fecha', 'acciones'];
  public objSol!: RecepcionCasosInterface;
  public objUser!: any;
  public dataSource = new MatTableDataSource<TablaRemisiones>([]);
  public dataSourceList: TablaRemisiones[] = [];
  public file!: File | null;
  private archivo!: string | null;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private seguimientoService: SeguimientoService,
    private _dialog: MatDialog,
    private modales: Modales,
    private authService: AuthService
  ) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.objUser = this.authService.currentUserValue!;
  }

  ngAfterViewInit() {
    this.cargarTabla();
    this.dataSource.paginator = this.paginator;
  }
  /**
   * @description carga la informacion para la tabla
   */
  private cargarTabla() {
    this.seguimientoService
      .getTablaSeguimiento(this.objSol.idTarea, this.objSol.idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.dataSourceList = data.data;
            this.dataSource = new MatTableDataSource(this.dataSourceList);
            this.dataSource.paginator = this.paginator;
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
   * @description guarda la informacion
   */
  private validarDataSource(): boolean {
    if (this.dataSourceList.length <= 0) {
      Modales.modalExito(
        'Debe registrar un formato de seguimiento',
        ImagenesModal.EXCLAMACION,
        this._dialog
      );
      return false;
    }
    return true;
  }

  /**
   * @description muestra el modal para el momento de cerrar la actuacion
   */
  modalCorfirmaCerrarActuacion() {
    if (this.validarDataSource()) {
      Modales.modalConfirmacion(
        Mensajes.MENSAJE_CERRAR_ACT,
        this._dialog,
        ImagenesModal.EXCLAMACION
      ).subscribe((res) => {
        if (res) this.cerrarActuaciones();
      });
    }
  }

  /**
   * @description finaliza la actuacion y genera la siguiente
   */

  public cerrarActuaciones() {
    const obj = {
      tareaID: this.objSol.idTarea,
      perfilCod: this.objUser.perfil!,
      userID: this.objUser.userID,
    };
    this.seguimientoService.cerrarActuaciones(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
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
   * @description redirecciona a la ruta principal de los casos
   */

  private redireccionar() {
    this.router.navigate(['../abogado/casos']);
  }
  /**
   * @description subir el archivo adjunto, e invocar servicio de blob storage
   */

  public cargarArchivo(e: any, row: any) {
    this.file = e.target.files && e.target.files[0] ? e.target.files[0] : null;

    if (this.file && this.validacionesArchivo(this.file)) {
      this.retornarArchivoBase64().then((d: any) => {
        const archivo = d.split(',');
        this.archivo = archivo[1];
        this.editarDocumento({
          entrada: archivo[1],
          idSolicitudServicio: this.objSol.idSolicitud,
          idSolicitudServicioAnexo: row.idAnexo,
        });
      });
    }
  }
  /**
   * @description valida el maximo valor del archivo que se carga
   * @param file archivo
   * @returns bolean
   */

  validacionesArchivo(file: File): boolean {
    let resultado: boolean = false;
    if (this.validarExtensionArchivo(file.name)) {
      if (this.validarTamanioArchivo(file.size)) {
        resultado = true;
      }
    }
    return resultado;
  }

  /**
   * @description valida extensión archivo
   * @param fileName nombre archivo
   * @returns boleano
   */
  validarExtensionArchivo(fileName: string) {
    let resultado = false;
    const allowedFiles = '.pdf';
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      if (allowedFiles === extension[0]) {
        resultado = true;
      }
    }
    return resultado;
  }

  /**
   * @description valida tamaño archivo pdf
   * @param size tamaño archivo
   * @returns boleano
   */
  validarTamanioArchivo(size: number) {
    return (size / 1024 / 1024).toFixed(4) <= LIMITE_CARGA ? true : false;
  }

  /**
   * @description retorna file a string base64
   * @param file archivo
   * @returns promesa
   */
  toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  /**
   * @description llama función para retornar archivo en base64
   * @returns promesa con archivo en base64
   */
  async retornarArchivoBase64() {
    return this.toBase64(this.file!);
  }

  /**
   * @description Descargar el adjunto que esta en el blob storage
   */
  public descargarArchivo(row: TablaRemisiones) {
    this.sharedService
      .ObtenerArchivoPorId(this.objSol.idSolicitud, row.idAnexo)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            const source = `data:application/pdf;base64,${data.data}`;
            const link = document.createElement('a');
            const fileName = row.nombreRemision;
            link.href = source;
            link.download = `${fileName}.pdf`;
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
   * @description borra la remision
   */
  private eliminarArchivo(row: TablaRemisiones) {
    this.sharedService
      .EliminarDocumentoPorID({
        idSolicitudServicio: this.objSol.idSolicitud,
        idSolicitudServicioAnexo: row.idAnexo,
      })
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              'Seguimiento eliminado satisfactoriamente',
              ImagenesModal.OK,
              this._dialog
            );
            this.cargarTabla();
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
   * @description muestra mensaje de confirmacion para eliminar formato
   * @param row fila de tabla de formato
   * @returns
   */
  public seguroEliminarFormato(row: TablaRemisiones): boolean {
    let respuesta: boolean = false;
    Modales.modalConfirmacion(
      `El documento ${row.nombreRemision}
    está a punto de ser eliminado. ¿Está seguro que desea continuar?`,
      this._dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((resp: boolean) => {
      if (resp) {
        this.eliminarArchivo(row);
      }
    });

    return respuesta;
  }

  /**
   * @description edita documento cargado en blog storage
   */
  private editarDocumento(datosEditar: EditarArvhivoRemision) {
    this.sharedService.editarDocumentoRemision(datosEditar).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_EDITAR_ARCHIVO,
            ImagenesModal.OK,
            this._dialog
          );
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
   * @description devuelve a pagina anterior
   */
  public cancelar() {
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_SOL,
      this._dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) {
        this.redireccionar();
      }
    });
  }

  /**
   * @description Archiva la diligencia
   */
  public archivarDiligencia() {
    this.modales.modalArchivarDiligencias(this.objSol);
  }

  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}
