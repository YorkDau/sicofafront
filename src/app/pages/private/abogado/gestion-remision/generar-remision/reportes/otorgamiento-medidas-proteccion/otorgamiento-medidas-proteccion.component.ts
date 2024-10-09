import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-otorgamiento-medidas-proteccion',
  templateUrl: './otorgamiento-medidas-proteccion.component.html',
  styleUrls: ['./otorgamiento-medidas-proteccion.component.scss'],
})
export class OtorgamientoMedidasProteccionComponent {
  @Input() dataReporte!: DataReporteInterface;
}
