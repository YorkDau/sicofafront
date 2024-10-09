import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject } from 'rxjs';
import { ReportesService } from 'src/app/services/reportes.services';
import { SharedFunctions } from '../../../functions';
import { SeguridadReyesApoyoInterface } from '../interfaces/seguridad-redes-apoyo.interface';

@Component({
  selector: 'app-seguridad-redes-apoyo-pdf',
  templateUrl: './seguridad-redes-apoyo-pdf.component.html',
  styleUrls: ['./seguridad-redes-apoyo-pdf.component.scss'],
})
export class SeguridadRedesApoyoPdfComponent
  implements AfterViewInit, OnChanges
{
  @Input() idSolicitud!: number;
  @Input() temp!: number;

  /* public idSolicitud: number = 0; */

  public reporte!: SeguridadReyesApoyoInterface | null;
  public nombreVictima!: string;
  public documentoVictima!: string;
  public lugarExpDocumentoVictima!: string;
  public tipoDocumentoVictima!: string;
  public nombreAgresor!: string;
  public documentoAgresor!: string;
  public tipoDocumentoAgresor!: string;
  public seguridad!: string;
  public redApoyoExterno!: string;
  public fechaImpresion!: Date;

  constructor(
    private reportesService: ReportesService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.reporte = null;
    this.nombreVictima = '';
    this.documentoVictima = '';
    this.tipoDocumentoVictima = '';
    this.lugarExpDocumentoVictima = '';
    this.nombreAgresor = '';
    this.documentoAgresor = '';
    this.tipoDocumentoAgresor = '';
    this.seguridad = '';
    this.redApoyoExterno = '';
    if (
      (changes['temp'] && this.temp) ||
      (changes['idSolicitud'] && this.idSolicitud)
    ) {
      this.getInitialData();
    }
  }
  /**
   * consulta todos los dominios necesarios en este reporte
   */
  getInitialData() {
    Promise.all([this.getInformacionReporte()]).then((values) => {
      this.spinnerService.show();
      setTimeout(() => {
        SharedFunctions.generarPdfOrientaciones();
        this.spinnerService.hide();
      }, 1000);
    });
  }

  ngAfterViewInit(): void {}

  private async getInformacionReporte() {
    if (this.idSolicitud > 0) {
      const result = await lastValueFrom(
        this.reportesService.getSeguridadRedesApoyo(this.idSolicitud)
      );
      if (result && result.statusCode == 200) {
        this.reporte = result.data;
        this.nombreVictima = this.reporte!.nombreVictima;
        this.documentoVictima = this.reporte!.documentoVictima;
        this.tipoDocumentoVictima = this.reporte!.tipoDocumentoVictima;
        this.lugarExpDocumentoVictima = this.reporte!.lugarExpedicionVictima;
        this.nombreAgresor = this.reporte!.nombreAgresor;
        this.documentoAgresor = this.reporte!.documentoAgresor;
        this.tipoDocumentoAgresor = this.reporte!.tipoDocumentoAgresor;
        this.seguridad = this.reporte!.seguridad;
        this.redApoyoExterno = this.reporte!.redApoyoExterno;
        this.fechaImpresion = new Date();

        if (!this.tipoDocumentoAgresor) {
          this.tipoDocumentoAgresor = 'C.C';
        }

        if (!this.tipoDocumentoVictima) {
          this.tipoDocumentoVictima = 'C.C';
        }
      }
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}
