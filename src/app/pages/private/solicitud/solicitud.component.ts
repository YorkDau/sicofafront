import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { InformacionCiudadanoInterface } from '../interfaces/ciudadano.interface';

export enum UseModalRemision {
  Familia = 1,
  Externa = 2,
  Remitida = 3,
}
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
})
export class SolicitudComponent implements OnChanges, OnInit {
  public tab1: boolean = true;
  public tab2: boolean = false;
  public solicitud: number = 0;
  public nombreCiudadano!: string;
  public infoCiudadano!: InformacionCiudadanoInterface;

  constructor(public dialog: MatDialog, activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((params) => {
      this.solicitud = params['id'];
    });
  }

  ngOnChanges() { }

  ngOnInit(): void {
    if (sessionStorage.getItem('ciudadano')) {
      const ciudadano = JSON.parse(sessionStorage.getItem('ciudadano')!);
      this.nombreCiudadano = `${ciudadano.nombres} ${ciudadano.apellidos}`;
    }
  }

  /**
   * @description cambia valores opcion1 y opcion2
   * @param tab 0 tab 1 - 1 tab 2
   */
  public cambiarTab(tab: number) {
    if (tab === 0) {
      this.tab1 = true;
      this.tab2 = false;
    } else {
      this.tab1 = false;
      this.tab2 = true;
    }
  }
}
