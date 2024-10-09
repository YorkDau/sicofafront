import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cabecera-reporte',
  templateUrl: './cabecera-reporte.component.html',
  styleUrls: ['./cabecera-reporte.component.scss']
})
export class CabeceraReporteComponent {
  @Input() tituloReporte: string = '';
}
