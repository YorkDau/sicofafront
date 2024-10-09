import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-remision-apoyo-policivo-mujer',
  templateUrl: './remision-apoyo-policivo-mujer.component.html',
  styleUrls: ['./remision-apoyo-policivo-mujer.component.scss'],
})
export class RemisionApoyoPolicivoMujerComponent {
  @Input() dataReporte!: DataReporteInterface;
}
