import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  DominiosEvaluacionOrientacion,
  Mensajes,
} from '../../../../../../../constants';
import { Modales } from '../../../../../../../shared/modals';
import { AppState } from '../../../../../../../store/app.reducer';
import { RespuestaEntrevistaRedes } from '../../../../../interfaces/psicologia.interface';
import { tarea } from '../../../../interfaces/caso-psicologia.interface';
import { EntrevistaPsicologicaEmocionalService } from '../../../../services/entrevista-psicologica-emocional.service';

@Component({
  selector: 'app-procedimiento-metodologia',
  templateUrl: './procedimiento-metodologia.component.html',
  styleUrls: ['./procedimiento-metodologia.component.scss'],
})
export class ProcedimientoMetodologiaComponent implements AfterViewInit {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  private tipoDominio = DominiosEvaluacionOrientacion.metodologia;
  public form: FormGroup;
  public date: Date = new Date();

  public showOnSubmitIsRequired: boolean = false;

  constructor(
    private modales: Modales,
    private formBuilder: FormBuilder,
    private entrevistaService: EntrevistaPsicologicaEmocionalService
  ) {
    this.form = this.formBuilder.group({
      descripcionA: ['', []],
      descripcionB: ['', []],
    });
  }

  ngAfterViewInit(): void {
    this.getInitialData();
  }

  /**
   * Consulta la información de descripcion por tipoDominio
   * @returns
   */
  public async getInitialData() {
    this.entrevistaService
      .getDescripciones(this.tarea.idSolicitud, this.tipoDominio)
      .subscribe({
        next: (result) => {
          if (result && result.statusCode == 200 && result.data) {
            const data = {
              descripcionA: result.data.descripcionA,
              descripcionB: result.data.descripcionB,
            };
            this.form.get('descripcionA')?.setValue(data.descripcionA);
            this.form.get('descripcionB')?.setValue(data.descripcionB);
          }
        },
      });
  }

  public actualizar() {
    let subject = new Subject<boolean>();
    if (this.tarea.idSolicitud) {
      const body: RespuestaEntrevistaRedes = {
        idSolicitudServicio: this.tarea.idSolicitud,
        tipoDominio: this.tipoDominio,
        descripcionA: this.form.get('descripcionA')?.value,
        descripcionB: this.form.get('descripcionB')?.value,
        respuestas: [],
      };
      this.entrevistaService.actualizarEvaluacionPsicologica(body).subscribe({
        next: (result) => {
          if (result && result.statusCode == 200) {
            subject.next(true);
          }
        },
        error: () => {
          subject.next(false);
        },
      });
    }
    return subject.asObservable();
  }

  cancelar() {
    this.siguientePaso.emit('Cancelar');
  }

  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea, '/psicologia');
  }

  guardar(evento: 'Siguiente' | 'Anterior') {
    this.showOnSubmitIsRequired = false;
    this.actualizar().subscribe((result) => {
      if (result) {
        this.siguientePaso.emit(evento);
      } else {
        this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
      }
    });
  }
}
