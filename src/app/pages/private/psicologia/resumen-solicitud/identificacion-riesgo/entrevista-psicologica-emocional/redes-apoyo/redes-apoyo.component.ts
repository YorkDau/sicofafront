import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  DominiosEvaluacionOrientacion,
  Mensajes,
  CodigosRespuesta,
} from '../../../../../../../constants';
import { Modales } from '../../../../../../../shared/modals';
import { AppState } from '../../../../../../../store/app.reducer';
import {
  RespuestaEntrevistaRedes,
  SugerenciaApoyo,
} from '../../../../../interfaces/psicologia.interface';
import { EntrevistaPsicologicaEmocionalService } from '../../../../services/entrevista-psicologica-emocional.service';

@Component({
  selector: 'app-redes-apoyo',
  templateUrl: './redes-apoyo.component.html',
  styleUrls: ['./redes-apoyo.component.scss'],
})
export class RedesApoyoComponent implements AfterViewInit {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  private tipoDominio = DominiosEvaluacionOrientacion.Red_apoyo;
  public form: FormGroup;
  public date: Date = new Date();
  public respuestasRedApoyo: SugerenciaApoyo[] = [];
  public respuestasTipoRedApoyo: SugerenciaApoyo[] = [];
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
    this.getDescripciones();
    this.getRedesApoyoChecks();
    this.getTipoRedApoyoChecks();
  }

  /**
   * Consulta la información de descripcion por tipoDominio
   * @returns
   */
  public getDescripciones() {
    this.entrevistaService
      .getDescripciones(this.tarea.idSolicitud, this.tipoDominio)
      .subscribe({
        next: (result) => {
          if (
            result &&
            result.statusCode === CodigosRespuesta.OK &&
            result.data
          ) {
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
  /**
   * Consulta los checks de la entrevista redes de apoyo
   * @returns
   */
  public getRedesApoyoChecks() {
    this.entrevistaService
      .getRedesApoyoChecks(this.tarea.idSolicitud)
      .subscribe({
        next: (result) => {
          if (
            result &&
            result.statusCode === CodigosRespuesta.OK &&
            result.data
          ) {
            this.respuestasRedApoyo = result.data;
            this.respuestasRedApoyo.forEach((element) => {
              this.form.addControl(
                'idDominio' + element.idDominio,
                new FormControl(element.respuesta)
              );
            });
          }
        },
      });
  }

  /**
   * Consulta los checks de la entrevista tipo redes de apoyo
   * @returns
   */
  public getTipoRedApoyoChecks() {
    this.entrevistaService
      .getTipoRedApoyoChecks(this.tarea.idSolicitud)
      .subscribe({
        next: (result) => {
          if (
            result &&
            result.statusCode === CodigosRespuesta.OK &&
            result.data
          ) {
            this.respuestasTipoRedApoyo = result.data;
            this.respuestasTipoRedApoyo.forEach((element) => {
              this.form.addControl(
                'idDominio' + element.idDominio,
                new FormControl(element.respuesta)
              );
            });
          }
        },
      });
  }

  public actualizar() {
    let subject = new Subject<boolean>();
    if (this.tarea.idSolicitud) {
      const respuestas: SugerenciaApoyo[] = [];
      const body: RespuestaEntrevistaRedes = {
        idSolicitudServicio: this.tarea.idSolicitud,
        tipoDominio: this.tipoDominio,
        descripcionA: this.form.get('descripcionA')?.value,
        descripcionB: this.form.get('descripcionB')?.value,
        respuestas: [],
      };
      this.respuestasRedApoyo.forEach((element) => {
        const value = this.form.get('idDominio' + element.idDominio)?.value;
        respuestas.push({
          idDominio: element.idDominio,
          respuesta: value ? true : false,
          nombreDominio: element.nombreDominio,
        });
      });

      this.respuestasTipoRedApoyo.forEach((element) => {
        const value = this.form.get('idDominio' + element.idDominio)?.value;
        respuestas.push({
          idDominio: element.idDominio,
          respuesta: value ? true : false,
          nombreDominio: element.nombreDominio,
        });
      });
      body.respuestas = respuestas;
      this.entrevistaService.actualizarEvaluacionPsicologica(body).subscribe({
        next: (result) => {
          if (result && result.statusCode === CodigosRespuesta.OK) {
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
