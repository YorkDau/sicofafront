import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-verificacion-derechos',
  templateUrl: './verificacion-derechos.component.html',
  styles: [],
})
export class VerificacionDerechosComponent implements OnChanges {
  @Input() datosReporte!: any;
  public nombreCompletos!: string;
  public fechaActual = new Date();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosReporte'] && this.datosReporte) {
      console.log('Datos que llegan al componente:', this.datosReporte);

      this.nombreCompletos = `${this.datosReporte.primerNombre ?? ''} ${this.datosReporte.segundoNombre ?? ''} ${this.datosReporte.primerApellido ?? ''} ${this.datosReporte.segundoApellido ?? ''}`.trim();
    }
  }

  get nombreCompleto(): string {
    return `${this.datosReporte.primerNombre ?? ''} ${this.datosReporte.segundoNombre ?? ''} ${this.datosReporte.primerApellido ?? ''} ${this.datosReporte.segundoApellido ?? ''}`.trim();
  }
}
