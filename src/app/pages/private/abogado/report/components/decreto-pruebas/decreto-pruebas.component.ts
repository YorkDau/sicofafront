import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-decreto-pruebas',
  templateUrl: './decreto-pruebas.component.html',
  styles: [],
})
export class DecretoPruebasComponent {
  @Input() datosReporte!: any;
}
