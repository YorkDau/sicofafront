import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  MensajeSolicitudXPerfil,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { DecisionJuezInterface } from '../../interfaces/decision-juez';
import { AbogadoService } from '../../services/abogado.service';

@Component({
  selector: 'app-lista-archivos',
  templateUrl: './lista-archivos.component.html',
  styleUrls: ['./lista-archivos.component.scss'],
  providers: [DatePipe],
})
export class ListaArchivosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public columnas!: Array<any>;
  public displayedColumns: string[] = [];
  public dataSource = new MatTableDataSource<DecisionJuezInterface[]>([]);
  public archivo!: string;
  public mensajeSinReg: string = MensajeSolicitudXPerfil.OTRO;

  private objSol!: any;
  private cargaJuezSub!: Subscription;

  constructor(
    private abogadoService: AbogadoService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.cargaJuezSub = abogadoService.cargaJuez$.subscribe((v) => {
      if (v) this.cargarListaPruebas();
    });
  }

  ngOnDestroy(): void {
    this.cargaJuezSub.unsubscribe();
  }

  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.armarColumnasGrid();
    this.cargarListaPruebas();
  }

  /**
   * @description arma las header de la grilla
   */
  private armarColumnasGrid() {
    this.columnas = [
      {
        key: 'nombrePrueba',
        header: 'Nombre de archivo',
      },
      {
        key: 'fechaCreacion',
        header: 'Fecha creación',
      },
      {
        key: 'fechaModificacion',
        header: 'Fecha modificación',
      },
    ];
    this.displayedColumns = this.columnas
      .map((c) => c.key)
      .concat(['Acciones']);
  }

  /**
   * @description llama servicio que llena grilla
   */
  private cargarListaPruebas() {
    const { idSolicitud, idTarea } = this.objSol;
    this.abogadoService
      .obtenerPruebaAsociadaJuez(idSolicitud, idTarea)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            const dataTransform = data.data;
            dataTransform.forEach((dj: any) => {
              dj.fechaCreacion = this.datePipe.transform(
                dj.fechaCreacion,
                'dd/MM/yyyy'
              )!;
              dj.fechaModificacion = this.datePipe.transform(
                dj.fechaModificacion,
                'dd/MM/yyyy'
              )!;
            });
            this.dataSource = new MatTableDataSource(dataTransform);
            this.dataSource.paginator = this.paginator;
          }
        },
      });
  }

  /**
   * @description descarga el archivo en formato pdf
   * @param row objeto de la grilla
   */
  public descargarArchivo(row: DecisionJuezInterface) {
    const { idAnexo, nombrePrueba } = row;

    this.obtenerDocumentoPruebaJuez(idAnexo).subscribe((archivo: string) => {
      if (archivo && archivo !== '') {
        const source = `data:application/pdf;base64,${archivo}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = `${nombrePrueba}.pdf`;
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
  private obtenerDocumentoPruebaJuez(idAnexo: number): Observable<string> {
    const { idSolicitud } = this.objSol;
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
   * @description llama servicio para editar archivo de la grilla
   * @param entrada base64 del archivo
   * @param row objeto a editar
   */
  public editarArchivo(entrada: string, row: DecisionJuezInterface) {
    this.abogadoService
      .editarPruebaJuez(this.armarObjEdicionArchivo(entrada, row))
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_EDITAR_ARCHIVO,
              ImagenesModal.OK,
              this.dialog
            );
            this.cargarListaPruebas();
          } else {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              ImagenesModal.EXCLAMACION
            );
          }
        },
      });
  }

  /**
   * @description arma objeto para editar
   * @param entrada base64
   * @param row objeto seleccionado en grilla
   */
  private armarObjEdicionArchivo(
    entrada: string,
    row: DecisionJuezInterface
  ): any {
    return {
      entrada,
      idSolicitudServicio: this.objSol.idSolicitud,
      idSolicitudServicioAnexo: row.idAnexo,
      idPrueba: row.idPrueba,
    };
  }
}
