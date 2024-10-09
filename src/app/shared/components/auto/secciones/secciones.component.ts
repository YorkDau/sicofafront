import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CodigosRespuesta } from 'src/app/constants';
import {
  SeccionesInterface,
  TreeInterface,
} from 'src/app/interfaces/auto.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { AutoService } from 'src/app/pages/private/abogado/services/auto.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.scss'],
})
export class SeccionesComponent implements OnInit {
  @Output() tituloPantalla = new EventEmitter<string>();
  @Output() observaciones = new EventEmitter<string>();
  @Output() aplicaRevision = new EventEmitter<boolean>();
  public listadoSecciones!: TreeInterface[];

  private listaSeccion!: SeccionesInterface[];
  private objSol!: any;

  public treeControl = new NestedTreeControl<TreeInterface>(
    (node) => node.leaf
  );
  public dataSource = new MatTreeNestedDataSource<TreeInterface>();

  constructor(private autoService: AutoService, private router: Router) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('info')) {
      this.objSol = JSON.parse(sessionStorage.getItem('info')!);
      this.cargarListadoSecciones();
    } else this.redireccionar();
  }

  /**
   * @description Carga las secciones del auto
   */
  private cargarListadoSecciones() {
    this.autoService
      .obtenerSecciones(this.objSol.idSolicitud)
      .subscribe((result: ResponseInterface) => {
        if (result.statusCode === CodigosRespuesta.OK) {
          this.listadoSecciones = result.data.tree;
          this.dataSource.data = this.listadoSecciones;
          this.listaSeccion = result.data.secciones;
          this.autoService.emitirArregloSecciones(this.listaSeccion);
          this.emitirTitulo(result.data.nombrePlantilla);
          this.aplicaRevision.emit(result.data.aplicaRevision || false);
          if (result.data.observacion)
            this.emitirObservaciones(result.data.observacion);
        }
      });
  }

  hasChild = (_: number, node: TreeInterface) =>
    !!node.leaf && node.leaf.length > 0;

  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar() {
    this.router.navigate(['../abogado/casos']);
  }

  /**
   * @description selecciona o desselecciona los padres
   * @param seccion sección a marcar o desmarcar
   */
  public seleccionarDesSeccion(seccion: TreeInterface) {
    setTimeout(() => {
      seccion.estado = !seccion.estado;
      this.devolverSeccion(seccion);
    }, 100);
  }

  /**
   * @description asigna al objeto sección al padre correspondiente
   * @param seccion objeto Tree
   */
  private devolverSeccion(seccion: TreeInterface) {
    seccion.seccion = this.listaSeccion.find(
      (s) => s.idSolPSeccion === seccion.idSolPSeccion
    )!;
    this.listaSeccion.forEach((item) => {
      if (item.idSolPSeccion === seccion.idSolPSeccion) {
        item.estadoSeccion = seccion.estado;
      }
    });
    this.emitirCambiosAuto(seccion);
  }

  /**
   * @description emite los cambios en el auto
   * @param seccion objeto auto|
   */
  public emitirCambiosAuto(seccion: TreeInterface) {
    this.autoService.emitirSeccionSeleccionada(seccion);
    this.autoService.emitirArregloSecciones(this.listaSeccion);
    if (seccion.seccion?.involucrados) {
      this.autoService.emitirSeccionHijaSeleccionada(
        seccion.seccion?.involucrados
      );
    }
  }

  /**
   * @description emite al padre el título del flujp
   * @param titulo del flujo
   */
  private emitirTitulo(titulo: string) {
    this.tituloPantalla.emit(titulo);
  }

  /**
   * @description emite al padre el observaciones dp
   * @param observaciones del comisario
   */
  private emitirObservaciones(observaciones: string) {
    this.observaciones.emit(observaciones);
  }
}
