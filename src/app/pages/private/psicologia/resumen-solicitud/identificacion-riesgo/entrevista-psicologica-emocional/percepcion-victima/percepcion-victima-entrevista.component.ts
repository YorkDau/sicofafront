import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {
  DominiosEvaluacionOrientacion,
  Mensajes,
} from '../../../../../../../constants';
import { Modales } from '../../../../../../../shared/modals';
import {
  RespuestaEntrevistaRedes,
  SugerenciaApoyo,
} from '../../../../../interfaces/psicologia.interface';
import { EntrevistaPsicologicaEmocionalService } from '../../../../services/entrevista-psicologica-emocional.service';
import { CodigosRespuesta } from 'src/app/constants';

@Component({
  selector: 'app-percepcion-victima-entrevista',
  templateUrl: './percepcion-victima-entrevista.component.html',
  styleUrls: ['./percepcion-victima-entrevista.component.scss'],
})
export class PercepcionVictimaEntrevistaComponent implements AfterViewInit {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  private tipoDominio = DominiosEvaluacionOrientacion.Persistencia;
  public form: FormGroup;
  public date: Date = new Date();
  public respuestasPersistencia: SugerenciaApoyo[] = [];
  public respuestasTipoRedApoyo: SugerenciaApoyo[] = [];
  public showOnSubmitIsRequired: boolean = false;

  constructor(
    private modales: Modales,
    private formBuilder: FormBuilder,
    private entrevistaService: EntrevistaPsicologicaEmocionalService,
    private dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      descripcionA: ['', []],
      descripcionB: ['', []],
    });
  }

  ngAfterViewInit(): void {
    this.getDescripciones();
    this.getPersistenciaChecks();
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
  public getPersistenciaChecks() {
    this.entrevistaService
      .getPersistenciaChecks(this.tarea.idSolicitud)
      .subscribe({
        next: (result) => {
          if (result && result.statusCode == 200 && result.data) {
            this.respuestasPersistencia = result.data;
            this.respuestasPersistencia.forEach((element) => {
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
   * @description valida que el formulario sea valido
   */
  private isValidForm(): boolean {
    const persistencia = this.respuestasPersistencia.filter((s) => s.respuesta);

    if (persistencia.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public cambiarFn(arreglo: SugerenciaApoyo[], idDominio: number) {
    setTimeout(() => {
      arreglo.forEach((element) => {
        if (element.idDominio === idDominio)
          element.respuesta = !element.respuesta;
      });
    }, 100);
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
      this.respuestasPersistencia.forEach((element) => {
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

  public cancelar() {
    this.siguientePaso.emit('Cancelar');
  }

  public archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea, '/psicologia');
  }

  public guardar(evento: 'Siguiente' | 'Anterior') {
    this.showOnSubmitIsRequired = false;
    if (this.isValidForm()) {
      this.actualizar().subscribe((result) => {
        if (result) {
          this.siguientePaso.emit(evento);
        } else {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        }
      });
    } else {
      Modales.modalInformacion(
        `Debe seleccionar por lo menos una opción de persistencia o evidencia de nuevos factores de riesgo`,
        this.dialog,
        'assets/images/exclamacion.svg'
      );
    }
  }
}
