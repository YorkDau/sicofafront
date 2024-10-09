import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';
import { listaArchivosInterface } from '../../../../interfaces/shared.interfaces';

@Component({
  selector: 'app-formatos-vacios',
  templateUrl: './formatos-vacios.component.html',
  styleUrls: ['./formatos-vacios.component.scss']
})
export class FormatosVaciosComponent implements OnInit {
@ViewChild(MatPaginator,{static: true}) paginator!: MatPaginator;
public displayedColumns: string[] = [
  'nombreDocumento',
  'versionDocumento',
  'acciones'
];
public dataSource = new MatTableDataSource<listaArchivosInterface>([]);
public dataSourceList: listaArchivosInterface[] = [];

  constructor(
    private sharedservice: SharedService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarListaArchivos();
  }
  /**
   * @description llama el servicio para poder cargar la lista de archivos
   */
  private cargarListaArchivos(){
    this.sharedservice.listarFormatos().subscribe({
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
      }
    });
  }

  public descargarFormato(row: listaArchivosInterface) {
    this.sharedservice.descargarFormatos(row.nombreDocumento, 'ss').subscribe({
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
      }
    });
  }

  /**
 * @description mensaje de error para lo servicios
 */
   private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}
