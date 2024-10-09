import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from '../../modals';
import { AnexosInterface, InformacionGeneralInterface } from '../interfaces/tareas.interface';

@Component({
  selector: 'app-tabla-anexos',
  templateUrl: './tabla-anexos.component.html',
  styleUrls: ['./tabla-anexos.component.scss']
})
export class TablaAnexosComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!:MatPaginator;
  public objSol = JSON.parse(sessionStorage.getItem('info')!);
  @Input() informacionGeneral!: InformacionGeneralInterface;
  public dataSource = new MatTableDataSource<AnexosInterface>([]);
  public dataSourceList: AnexosInterface[] = [];
  public displayedColumns: string[] =[
    'nombreDocumento',
    'nombreArchivo',
    'fechaCreacion',
    'acciones'
  ];
  constructor(
    private sharedService: SharedService,
    private _dialog: MatDialog
    ) { }

  ngOnInit(): void {
   this.cargarDataSource();
  }
  /**
   * @description Carga La informacion de la tabla de anexos
   */
  private cargarDataSource(){
    this.dataSourceList = this.informacionGeneral.anexos;
    this.dataSource = new MatTableDataSource(this.dataSourceList);
    this.dataSource.paginator = this.paginator;
  }
  /**
   * @description notifica si la informacion no tiene anexos
   * @returns boolean
   */
  public noTieneAnexos(): boolean{
    if (this.informacionGeneral.anexos.length <= 0) {
      return false
    }
    return true
  }

  /**
   * @description Descargar el adjunto que esta en el blob storage
   */
   public descargarArchivo(row: AnexosInterface) {
    
    this.sharedService
      .ObtenerArchivoPorId(this.objSol.idSolicitud, row.idAnexo)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            const source = `data:application/pdf;base64,${data.data}`;
            const link = document.createElement('a');
            const fileName = row.nombreDocumento;
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
private msgError() {
  Modales.modalExito(
    Mensajes.MENSAJE_ERROR_G,
    ImagenesModal.EXCLAMACION,
    this._dialog
  );
}
}
