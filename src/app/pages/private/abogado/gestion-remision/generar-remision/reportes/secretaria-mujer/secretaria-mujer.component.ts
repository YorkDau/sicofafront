import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-secreataria-mujer',
  templateUrl: './secretaria-mujer.component.html',
  styleUrls: ['./secretaria-mujer.component.scss'],
})
export class SecretariaMujerComponent {
  @Input() dataReporte!: DataReporteInterface;
}
