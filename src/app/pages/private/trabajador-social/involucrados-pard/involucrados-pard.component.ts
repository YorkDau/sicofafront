import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  MensajeSolicitudXPerfil,
  TiposDocumentoCarga,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Modales } from 'src/app/shared/modals';
import { ReporteTrabajadorSocialPDF } from '../report/report-pdf';
import { TrabajadorSocialService } from '../services/trabajador-social.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-actualizar-involucrados',
  templateUrl: './involucrados-pard.component.html',
  styles: [],
})
export class InvolucradosPARDComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public columnas!: Array<any>;
  public displayedColumns: string[] = [];
  public dataSource = new MatTableDataSource<any[]>();
  public archivo!: string;
  public mensajeSinReg: string = MensajeSolicitudXPerfil.OTRO;
  public datosReportes!: any;
  private listadoPARD: any[] = [];
  private user!: UserInterface | undefined;
  private objSol!: any;

  constructor(
    private trabajadorSocialService: TrabajadorSocialService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnInit(): void {
    this.consultarSolicitudes();
    this.user = this.authService.currentUserValue;
  }

  /**
   * @description arma las header de la grilla
   */
  private armarColumnasGrid(): void {
    this.columnas = [
      {
        key: 'nombres',
        header: 'Nombres',
      },
      {
        key: 'apellidos',
        header: 'Apellidos',
      },
      {
        key: 'tipoDocumento',
        header: 'T. de Documento',
      },
      {
        key: 'numeroDocumento',
        header: 'No. de documento',
      },
      {
        key: 'tipoInvolucrado',
        header: 'Tipo involucrado',
      },
    ];
    this.displayedColumns = this.columnas
      .map((c) => c.key)
      .concat(['Acciones']);
  }

  /**
   * @description llama servicio para llenar la grilla
   */
  private consultarSolicitudes(): void {
    this.trabajadorSocialService
      .listarInvolucradosComplementariaInfo(this.objSol.idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.listadoPARD = data.data;
            this.ajustarResultadoConsulta(data.data);
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
   * @description ajusta el resultado de la consulta para mostrarlo
   * @param data arreglo con resultado de la consulta
   */
  private ajustarResultadoConsulta(data: any[]): void {
    let array: any[] = [];
    data.forEach((d: any) => {
      array.push({
        nombres: d.primerNombre + ' ' + d.segundoNombre,
        apellidos: d.primerApellido + ' ' + d.segundoApellido,
        tipoDocumento: d.tipoDocumento,
        numeroDocumento: d.numeroDocumento,
        tipoInvolucrado: d.esVictima ? 'Accionante' : 'Accionado',
      });
    });

    this.dataSource = new MatTableDataSource(array);
    this.dataSource.paginator = this.paginator;

    this.armarColumnasGrid();
  }

  /**
   * @description asigna el objeto al storage para editar
   * @param row objeto a editar
   */
  public editarRegistro(row: any): void {
    sessionStorage.setItem(
      'inv_pard',
      JSON.stringify(this.obtenerFilaGrid(row))
    );
  }

  /**
   * @description llama clase que genera el reporte
   */
  public generarReporte(row: any) {
    this.datosReportes = this.obtenerFilaGrid(row);
    setTimeout(() => {
      ReporteTrabajadorSocialPDF.actaVerificacionDerechos();
    }, 400);
  }

  /**
   * @description  obtiene la fila de la grilla
   * @param row informacion
   * @returns any
   */
  private obtenerFilaGrid(row: any): any {
    return this.listadoPARD.find(
      (v) => v.numeroDocumento === row.numeroDocumento
    );
  }

  /**
   * @description llama servicio de carga archivo
   */
  public cargarArchivo(entrada: string, row: any): void {
    if (entrada) {
      this.trabajadorSocialService
        .cargaActaVerificacionDerechos(
          this.retornarObjCargaArchivo(entrada, row)
        )
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              Modales.modalExito(
                Mensajes.MENSAJE_CARGA,
                ImagenesModal.OK,
                this.dialog
              );
              this.consultarSolicitudes();
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

  /**
   * @description devuelve objeto para cargar editar archivo
   * @param row objeto para asociar el archivo
   * @returns objeto a insertar
   */
  private retornarObjCargaArchivo(entrada: string, row: any): any {
    const obj = this.obtenerFilaGrid(row);
    return {
      idInvolucrado: obj.idInvolucrado,
      idAnexoServicio: obj.idAnexoSolicitud | 0,
      archivo: {
        entrada,
        nombrearchivo: '',
        tipoDocumento: TiposDocumentoCarga.ACTA_VERIFICACION_DERECHOS,
        idSolicitudServicio: obj.idSolicitudServicio,
        idUsuario: this.user?.userID,
        idComisaria: this.user?.idComisaria,
      },
    };
  }

  /**
   * @description descarga el archivo en formato pdf
   * @param row objeto de la grilla
   */
  public descargarArchivo(row: any): any {
    const obj = this.obtenerFilaGrid(row);

    this.obtenerDocumentoPARD(
      obj.idAnexoSolicitud,
      obj.idSolicitudServicio
    ).subscribe((archivo: string) => {
      if (archivo && archivo !== '') {
        const source = `data:application/pdf;base64,${archivo}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = `${obj.nombreDocumento}.pdf`;
        link.click();
      } else {
        Modales.modalInformacion(
          'Error al descargar documento',
          this.dialog,
          ImagenesModal.EXCLAMACION
        );
      }
    });
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

    this.trabajadorSocialService
      .obtenerArchivoPorId(idSolicitud, idAnexo)
      .subscribe({
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
   * @param visualReporte true si es para visualizar reporte y cargarlo
   * @returns booleano
   */
  public ocultarDescargarReporte(row: any, visualReporte?: boolean): boolean {
    const obj = this.obtenerFilaGrid(row);

    if (obj.esVictima) {
      if (visualReporte) return true;
      else {
        if (obj.idAnexoSolicitud) {
          return true;
        } else {
          return false;
        }
      }
    } else return false;
  }
}
