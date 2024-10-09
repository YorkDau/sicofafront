import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-psicologia-externa',
  templateUrl: './psicologia-externa.component.html',
  styleUrls: ['./psicologia-externa.component.scss'],
})
export class PsicologiaExternaComponent {
  @Input() dataReporte!: DataReporteInterface;
}
