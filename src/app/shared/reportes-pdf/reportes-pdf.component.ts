import { AfterViewInit, Component } from '@angular/core';
import { TipoReportePdf } from '../../constants';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reportes-pdf',
  templateUrl: './reportes-pdf.component.html',
  styleUrls: ['./reportes-pdf.component.scss'],
})
export class ReportesPdfComponent implements AfterViewInit {
  public fileUrl: string = '';
  public tipos = TipoReportePdf;
  public tipo!: TipoReportePdf;
  
  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      if (
        params &&
        params['tipoReporte'] != undefined &&
        params['idSolicitud']
      ) {
        this.tipo = params['tipoReporte'];
      }
    });
  }

  /**
   * Inmediatamente después de cargar la vista imprimimos
   */
  ngAfterViewInit(): void {}

  imprimir() {}
}
