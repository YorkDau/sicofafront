import { Component, Input } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-denuncia-fiscalia',
  templateUrl: './denuncia-fiscalia.component.html',
  styleUrls: ['./denuncia-fiscalia.component.scss'],
})
export class DenunciaFiscaliaComponent {
  @Input() dataReporte!: DataReporteInterface;
}
