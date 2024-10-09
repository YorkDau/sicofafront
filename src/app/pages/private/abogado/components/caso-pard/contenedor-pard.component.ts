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

  constructor() {}

  ngOnInit(): void {}

  /**
   * @description cambia valores opcion1 y opcion2
   * @param tab 0 tab 1 - 1 tab 2
   */
  public cambiarTab(tab: number) {
    if (tab === 0) {
      this.tab0 = true;
      this.tab1 = false;
      this.tab2 = false;
    } else if (tab === 1) {
      this.tab0 = false;
      this.tab1 = true;
      this.tab2 = false;
    } else {
      this.tab0 = false;
      this.tab1 = false;
      this.tab2 = true;
    }
  }
}
