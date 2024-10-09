import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-medicina-legal',
  templateUrl: './medicina-legal.component.html',
  styleUrls: ['./medicina-legal.component.scss'],
})
export class MedicinaLegalComponent {
  @Input() dataReporte!: DataReporteInterface;
}
