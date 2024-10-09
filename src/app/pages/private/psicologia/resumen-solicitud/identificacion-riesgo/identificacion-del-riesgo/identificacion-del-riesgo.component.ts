import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedFunctions } from 'src/app/shared/functions';
import { TipoReportePdf } from '../../../../../../constants';
import { Modales } from '../../../../../../shared/modals';

@Component({
  selector: 'app-identificacion-del-riesgo',
  templateUrl: './identificacion-del-riesgo.component.html',
  styleUrls: ['./identificacion-del-riesgo.component.scss'],
})
export class IdentificacionDelRiesgoComponent {
  @Output() siguienteTab: EventEmitter<'Anterior' | 'Siguiente'> =
    new EventEmitter<'Anterior' | 'Siguiente'>();

  @ViewChild('stepper') stepper!: MatStepper;

  public orientation: StepperOrientation = 'horizontal';
  public tipoPdf = TipoReportePdf.IDENTIFICACION_RIESGO;
  public tarea = JSON.parse(sessionStorage.getItem('info')!);

  public idSolicitudInput: number = 0;
  public mostrarHtml: boolean = false;
  private filasHijos: number = 0;

  temp = 0;

  constructor(
    private modales: Modales,
    private title: Title,
    private spinner: NgxSpinnerService
  ) {
    this.title.setTitle(
      'SICOFA - Identificación riesgo - Identificación del riesgo'
    );
    if (window.screen.width <= 768) {
      this.orientation = 'vertical';
    } else {
      this.orientation = 'horizontal';
    }
  }

  cambiarPasoIdentificacionDelRiesgo(
    accion: 'Cancelar' | 'Anterior' | 'Siguiente'
  ) {
    switch (accion) {
      case 'Anterior':
        this.stepper.previous();
        break;
      case 'Siguiente':
        this.stepper.next();
        break;
      case 'Cancelar':
        this.modales.modalCancelar('/psicologia');
        break;
    }
  }

  cambiarTab(evento: 'Anterior' | 'Siguiente') {
    this.siguienteTab.emit(evento);
  }

  /**
   * @description Obtiene cantidad de filas de hijos
   * @param e @de
   */
  getFilasHijos(e: any) {
    this.filasHijos = e;
  }

  /**
   * @description Imprime pdf vacio
   */
  imprimirPDFVacio() {
    this.mostrarHtml = true;
    this.idSolicitudInput = 0;
    this.temp = Date.now();
  }

  /**
   * @description Imprime pdf completo
   */
  imprimirPDFCompleto() {
    this.mostrarHtml = true;
    this.idSolicitudInput = this.tarea.idSolicitud;
    this.temp = Date.now();
  }
}
