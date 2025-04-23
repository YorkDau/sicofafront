import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contenedor-pard',
  templateUrl: './contenedor-pard.component.html',
  styles: [],
})
export class ContenedorPardComponent implements OnInit {
  public tab0: boolean = true;
  public tab1: boolean = false;
  public tab2: boolean = false;

  // 🔒 Control de visibilidad del tab2
  public mostrarTab2: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  /**
   * @description cambia valores tab0, tab1 y tab2
   * @param tab número del tab a activar
   */
  public cambiarTab(tab: number): void {
    if (tab === 0) {
      this.tab0 = true;
      this.tab1 = false;
      this.tab2 = false;
    } else if (tab === 1) {
      this.tab0 = false;
      this.tab1 = true;
      this.tab2 = false;
    } else if (tab === 2 && this.mostrarTab2) {
      // Solo permite activar tab2 si está visible
      this.tab0 = false;
      this.tab1 = false;
      this.tab2 = true;
    }
  }
}
