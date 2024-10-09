import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CodigosRespuesta, MensajeSolicitudXPerfil } from 'src/app/constants';

import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  DepartamentoInterface,
  MunicipioInterface,
} from 'src/app/pages/private/interfaces/ciudadano.interface';
import { SharedService } from 'src/app/services/shared.service';
import { AppState } from 'src/app/store/app.reducer';
import { ComisariaService } from '../service/comisaria.service';

@Component({
  selector: 'app-listado-comisarias',
  templateUrl: './listado-comisarias.component.html',
  styleUrls: ['./listado-comisarias.component.scss'],
})
export class ListadoComisariasComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public comisariasForm!: FormGroup;
  public listaCiudad: MunicipioInterface[] = [];
  public listaDepto: DepartamentoInterface[] = [];
  public dataSource = new MatTableDataSource<any[]>([]);
  public mensajeSinReg: string = MensajeSolicitudXPerfil.OTRO;
  public displayedColumns: string[] = [];
  public columnas!: any[];

  private listadoComisarias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private sharedService: SharedService,
    private comisariaService: ComisariaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDepartamento();
    this.cargarForm();
    sessionStorage.removeItem('comisaria');
  }

  /**
   * @description inicializa formulario
   */
  private cargarForm(): void {
    this.comisariasForm = this.fb.group({
      idCiudadMunicio: 0,
      nombreComisaria: '',
      idDepartamento: 0,
    });
  }

  /**
   * @description llena lista departamento del state
   */
  private cargarDepartamento(): void {
    this.store.select('departamento').subscribe(({ departamento }) => {
      this.listaDepto = departamento;
    });
  }

  /**
   * @description carga llama servicio que carga las ciudades
   * @param idDepto id del depto
   */
  public cargarCiudades(idDepto: number): void {
    this.sharedService
      .getCiudades(idDepto)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaCiudad = data.data;
        }
      });
  }

  /**
   * @description arma las columnas de la grilla y asigna el datasource
   */
  private armarColumnas(): void {
    this.columnas = [
      {
        header: 'Nombre comisaría',
        key: 'nombreComisaria',
      },
      {
        header: 'Teléfono',
        key: 'telefono',
      },
      {
        header: 'Dirección',
        key: 'direccion',
      },
      {
        header: 'Correo',
        key: 'correo',
      },
    ];

    this.displayedColumns = this.columnas
      .map((c) => c.key)
      .concat(['Acciones']);
  }

  /**
   * @description llama servicio que llena la grilla
   */
  public consultarComisarias(): void {
    this.comisariaService
      .consultarComisaria(this.comisariasForm.value)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listadoComisarias = data.data;
          this.dataSource = new MatTableDataSource(this.listadoComisarias);
          this.dataSource.paginator = this.paginator;
          this.armarColumnas();
        } else {
          this.listadoComisarias = [];
          this.dataSource = new MatTableDataSource(this.listadoComisarias);
        }
      });
  }

  /**
   * @description almacena objeto para editar la comisaría
   * @param row objeto a editar
   */
  public editarComisaria(row: any): void {
    const obj = this.retornarObjGrid(row);
    if (obj) {
      sessionStorage.setItem('comisaria', JSON.stringify(obj));
      this.router.navigate(['../administrador/comisaria']);
    }
  }

  /**
   * @description obtiene el objeto por índice
   * @param row objeto a buscar
   * @returns objeto a retornar
   */
  private retornarObjGrid(row: any): any {
    return this.listadoComisarias[this.dataSource.filteredData.indexOf(row)];
  }
}
