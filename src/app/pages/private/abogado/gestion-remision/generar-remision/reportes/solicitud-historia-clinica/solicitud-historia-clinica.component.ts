import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-solicitud-historia-clinica',
  templateUrl: './solicitud-historia-clinica.component.html',
  styleUrls: ['./solicitud-historia-clinica.component.scss'],
})
export class SolicitudHistoriaClinicaComponent {
  @Input() dataReporte!: DataReporteInterface;
}
