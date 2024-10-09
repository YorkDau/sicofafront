import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-remision-sistema-salud',
  templateUrl: './remision-sistema-salud.component.html',
  styleUrls: ['./remision-sistema-salud.component.scss'],
})
export class RemisionSistemaSaludComponent {
  @Input() dataReporte!: DataReporteInterface;
}
