import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, MensajeSolicitudXPerfil } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ComisariaService } from '../service/comisaria.service';

@Component({
  selector: 'app-listado-comisarios',
  templateUrl: './listado-comisarios.component.html',
  styles: [],
})
export class ListadoComisariosComponent implements OnInit {
  @Input() idComisaria!: number;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public dataSource = new MatTableDataSource<any[]>([]);
  public mensajeSinReg: string = MensajeSolicitudXPerfil.OTRO;
  public displayedColumns: string[] = [];
  public columnas!: any[];

  constructor(private comisariaService: ComisariaService) {}

  ngOnInit(): void {
    this.consultarUsuarioComisaria();
  }

  /**
   * @description filtra la grilla
   * @param event event del textbox
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description llama servicio que consulta el usuario de la comisaría
   */
  private consultarUsuarioComisaria() {
    this.comisariaService
      .consultarUsuarioComisaria(this.idComisaria)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.dataSource = new MatTableDataSource(data.data);
          this.dataSource.paginator = this.paginator;
          this.armarColumnas();
        }
      });
  }

  /**
   * @description arma las columnas de la grilla y asigna el datasource
   */
  private armarColumnas(): void {
    this.columnas = [
      {
        header: 'Tipo documento',
        key: 'codigotipoDocumento',
      },
      {
        header: 'Número Documento',
        key: 'numeroDocumento',
      },
      {
        header: 'Nombres',
        key: 'nombres',
      },
      {
        header: 'Apellidos',
        key: 'apellidos',
      },
      {
        header: 'Correo',
        key: 'correoElectronico',
      },
    ];

    this.displayedColumns = this.columnas.map((c) => c.key);
  }
}
