import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InformacionGeneralInterface, TareasInterface } from '../interfaces/tareas.interface';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!:MatPaginator;
  @Input() informacionGeneral!: InformacionGeneralInterface;

  public dataSource = new MatTableDataSource<TareasInterface>([]);
  public dataSourceList: TareasInterface[] = [];
  public displayedColumns: string[] =[
    'nombreTarea',
    'nombreProceso',
    'usuario',
    'fechaCreacion',
    'fechaTerminacion',
    'estadoTarea'
  ];
  constructor() { }

  ngOnInit(): void {
    this.cargarDataSource();
  }
  /**
   * @description carga los datos de la tabla de tareas
   */
  private cargarDataSource(){
    this.dataSourceList = this.informacionGeneral.tareas;
    this.dataSource = new MatTableDataSource(this.dataSourceList);
    this.dataSource.paginator = this.paginator;
  }

}
