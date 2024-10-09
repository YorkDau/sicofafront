import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-verificacion-derechos',
  templateUrl: './verificacion-derechos.component.html',
  styles: [],
})
export class VerificacionDerechosComponent {
  @Input() datosReporte!: any;
  public nombreCompletos!: string;
  public fechaActual = new Date();

  constructor() {
    if (this.datosReporte) {
      this.nombreCompletos = `${this.datosReporte.primerNombre} ${this.datosReporte.segundoNombre} ${this.datosReporte.primerApellido} ${this.datosReporte.segundoApellido}`;
    }
  }

  get nombreCompleto(): string {
    return `${this.datosReporte.primerNombre} ${this.datosReporte.segundoNombre} ${this.datosReporte.primerApellido} ${this.datosReporte.segundoApellido}`;
  }
}
