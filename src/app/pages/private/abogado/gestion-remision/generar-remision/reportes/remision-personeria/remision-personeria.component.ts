import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-remision-personeria',
  templateUrl: './remision-personeria.component.html',
  styleUrls: ['./remision-personeria.component.scss'],
})
export class RemisionPersoneriaComponent {
  @Input() dataReporte!: DataReporteInterface;
}
