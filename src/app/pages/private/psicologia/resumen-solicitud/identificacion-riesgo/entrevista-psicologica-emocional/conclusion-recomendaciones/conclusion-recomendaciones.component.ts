import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { lastValueFrom, Subject } from 'rxjs';
import {
  DominiosEvaluacionOrientacion,
  Mensajes,
  TipoReportePdf,
  TiposDocumentoCarga,
} from '../../../../../../../constants';
import { ArchivoInterface } from '../../../../../../../interfaces/shared.interfaces';
import { SharedService } from '../../../../../../../services/shared.service';
import { Modales } from '../../../../../../../shared/modals';
import { RespuestaEntrevistaRedes } from '../../../../../interfaces/psicologia.interface';
import { EntrevistaPsicologicaEmocionalService } from '../../../../services/entrevista-psicologica-emocional.service';

@Component({
  selector: 'app-conclusion-recomendaciones',
  templateUrl: './conclusion-recomendaciones.component.html',
  styleUrls: ['./conclusion-recomendaciones.component.scss'],
})
export class ConclusionRecomendacionesComponent implements AfterViewInit {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
  @Output() siguienteTab: EventEmitter<'Anterior' | 'Siguiente'> =
    new EventEmitter<'Anterior' | 'Siguiente'>();
  @Output()
  imprimirPDFCompleto = new EventEmitter<string>();
  public tarea = JSON.parse(sessionStorage.getItem('info')!);

  private tipoDominio = DominiosEvaluacionOrientacion.conclusiones;
  public form: FormGroup;
  public date: Date = new Date();
  public tipoPdf = TipoReportePdf.ENTREVISTA_PSICOLOGICA_EMOCIONAL;
  public file!: ArchivoInterface | null;

  constructor(
    private modales: Modales,
    private formBuilder: FormBuilder,
    private entrevistaService: EntrevistaPsicologicaEmocionalService,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      descripcionA: [''],
      descripcionB: [''],
      file: [null],
    });
  }

  ngAfterViewInit(): void {
    this.getDescripciones();
    this.obtenerArchivoCargado();
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

  guardar(evento?: 'Siguiente' | 'Anterior', mensaje: boolean = true) {
    let subject = new Subject<boolean>();
    this.actualizar().subscribe((result) => {
      if (result) {
        subject.next(true);
        if (evento) {
          if (evento == 'Siguiente') {
            this.modales
              .modalExito('Datos guardados exitosamente.')
              .subscribe(() => {
                this.siguienteTab.emit(evento);
              });
          } else {
            this.siguientePaso.emit(evento);
          }
        } else {
          mensaje
            ? this.modales.modalExito('Datos guardados exitosamente.')
            : '';
        }
      } else {
        subject.next(false);
        this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
      }
    });
    return subject.asObservable();
  }

  /**
   * @description Imprime formato completo en PDF
   */
  imprimirCompleto() {
    if (this.tarea && this.tarea.idSolicitud) {
      this.guardar(undefined, false).subscribe(() => {
        this.imprimirPDFCompleto.emit();
      });
    } else {
      this.modales.modalInformacion(
        'Para imprimir el documento completo debes completar todos los pasos de identificacion del riesgo primero.'
      );
    }
  }

  cargarArchivo(base64: string) {
    if (base64) {
      this.sharedService
        .guardarArchivo({
          idSolicitudServicio: this.tarea.idSolicitud,
          entrada: base64,
          nombrearchivo: null,
          tipoDocumento: TiposDocumentoCarga.ENTREVISTA_PSICOLOGICA_EMOCIONAL,
        })
        .subscribe(async (result) => {
          if (result && result.statusCode == 200) {
            await this.obtenerArchivoCargado();
            this.modales.modalExito('Archivo cargado exitosamente');
          }
        });
    } else {
      this.file = null;
      this.form.get('file')?.setValue(null);
    }
  }

  async obtenerArchivoCargado() {
    const resultConsultar = await lastValueFrom(
      this.sharedService.ConsultarArchivos(
        this.tarea.idSolicitud,
        TiposDocumentoCarga.ENTREVISTA_PSICOLOGICA_EMOCIONAL
      )
    );
    if (
      resultConsultar &&
      resultConsultar.statusCode == 200 &&
      resultConsultar.data &&
      resultConsultar.data[0]
    ) {
      this.file = {
        idSolicitud: this.tarea.idSolicitud,
        idArchivo: resultConsultar.data[0].idSolicitudDocumento,
        nombreArchivo: resultConsultar.data[0].nombreDocumento,
      };
      this.form.get('file')?.setValue(true);
    }
  }
}
