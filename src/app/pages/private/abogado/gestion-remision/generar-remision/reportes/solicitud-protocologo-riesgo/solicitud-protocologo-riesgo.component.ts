import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-solicitud-protocologo-riesgo',
  templateUrl: './solicitud-protocologo-riesgo.component.html',
  styleUrls: ['./solicitud-protocologo-riesgo.component.scss'],
})
export class SolicitudProtocologoRiesgoComponent {
  @Input() dataReporte!: DataReporteInterface;
}
