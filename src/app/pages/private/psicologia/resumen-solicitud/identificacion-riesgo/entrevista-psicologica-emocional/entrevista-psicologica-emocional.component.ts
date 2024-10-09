import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedFunctions } from 'src/app/shared/functions';
import { AppState } from 'src/app/store/app.reducer';
import { TipoReportePdf } from '../../../../../../constants';
import { Modales } from '../../../../../../shared/modals';

@Component({
  selector: 'app-entrevista-psicologica-emocional',
  templateUrl: './entrevista-psicologica-emocional.component.html',
  styleUrls: ['./entrevista-psicologica-emocional.component.scss'],
})
export class EntrevistaPsicologicaEmocionalComponent {
  @Output() siguienteTab: EventEmitter<'Anterior' | 'Siguiente'> =
    new EventEmitter<'Anterior' | 'Siguiente'>();
  @ViewChild('stepper') stepper!: MatStepper;
  public temp: number = 0;
  public idSolicitud: number = 0;
  public orientation: StepperOrientation = 'horizontal';
  public tipoPdf = TipoReportePdf.ENTREVISTA_PSICOLOGICA_EMOCIONAL;
  public tarea = JSON.parse(sessionStorage.getItem('info')!);

  public mostrarHtml: boolean = false;

  constructor(
    private modales: Modales,
    private title: Title,
    private spinner: NgxSpinnerService
  ) {
    this.title.setTitle(
      'SICOFA - Identificación riesgo - Entrevista Psicológica y emocional'
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

  imprimirPDFVacio() {
    this.mostrarHtml = true;
    this.idSolicitud = 0;
    this.temp = Date.now();
  }

  imprimirPDFCompleto() {
    this.mostrarHtml = true;
    this.idSolicitud = this.tarea.idSolicitud;
    this.temp = Date.now();
  }
}
