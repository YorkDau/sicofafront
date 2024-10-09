import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-visita-domiciliaria',
  templateUrl: './visita-domiciliaria.component.html',
  styleUrls: ['./visita-domiciliaria.component.scss'],
})
export class VisitaDomiciliariaComponent {
  @Input() dataReporte!: DataReporteInterface;
}
