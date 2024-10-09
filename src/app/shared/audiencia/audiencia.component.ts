import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent } from 'angular-calendar';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import * as validaciones from './validators';
import { Modales } from 'src/app/shared/modals';
import { AudienciaService } from '../../pages/private/abogado/services/audiencia.service';
import { ResponseInterface } from '../../interfaces/response.interface';
import { PostDataProgramacionAudiencia } from '../../pages/private/abogado/interfaces/audiencia';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RecepcionCasosInterface } from '../../interfaces/recepcion-casos.interface';
import { Observable, of, Subject } from 'rxjs';
import { ProgramacionService } from '../../pages/private/abogado/services/programacion.service';
import {
  ItemProgramacionInterface,
  ProgramacionInterface,
  TipoProgramacionInterface,
} from '../../interfaces/programacion.interface';

@Component({
  selector: 'app-audiencia',
  templateUrl: './audiencia.component.html',
  styleUrls: ['./audiencia.component.scss'],
  providers: [DatePipe],
})
export class AudienciaComponent implements OnInit {
  public objSol: RecepcionCasosInterface | null = JSON.parse(
    sessionStorage.getItem('info')!
  );

  public minDate: Date = new Date();
  public maxDate: Date = new Date(
    new Date().setDate(new Date().getDate() + 365)
  ); //maximo de 1 año
  public mostrarValidaciones: boolean = false;
  public mostrarValidacionesFechas: boolean = false;

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgFinalMenorInicio: string = Mensajes.MENSAJE_FECHA_INFERIOR;
  public msgMenorFechaActual: string = Mensajes.MENSAJE_FECHA_MENOR_ACTUAL;

  public listaTiposProgramacion: TipoProgramacionInterface[] = [];
  public listaProgramaciones: ItemProgramacionInterface[] = [];
  public programacionActual!: ProgramacionInterface;

  public eventosCalendario: CalendarEvent[] = [];
  public form: FormGroup = this.fb.group(
    {
      razon: ['', [Validators.required]],
      fechaInicial: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
    },
    {
      validators: [
        validaciones.validarFechaInicial(),
        validaciones.validarFechaActualMayorInicial(),
        validaciones.validarFechaActualMayorFinal(),
      ],
    }
  );

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modales: Modales,
    private programacionService: ProgramacionService
  ) {}

  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.obtenerAudiencias();
  }

  /**
   * @description Obtiene todas las audiencias programadas
   */
  private obtenerAudiencias() {
    this.programacionService
      .obtenerProgramacion(this.objSol?.idTarea!)
      .subscribe({
        next: (result) => {
          if (result && result.statusCode === CodigosRespuesta.OK) {
            this.listaTiposProgramacion = result.data.listTiposAudiencia || [];
            this.listaProgramaciones = result.data.listaProgramaciones || [];
            this.programacionActual = result.data;
            this.actualizarEventosCalendario();
            this.setFormData();
          }
        },
        error: () => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        },
      });
  }

  private setFormData() {
    if (this.programacionActual) {
      this.form.setValue({
        razon: this.programacionActual.idTipoAudiencia || '',
        fechaInicial: this.programacionActual.fechaHoraInicial.slice(0, 16),
        fechaFinal: this.programacionActual.fechaHoraFinal.slice(0, 16),
      });
    }
  }

  transformDate(date: string, format: string = 'dd/MM/yyyy hh:mm') {
    return this.datePipe.transform(date, format);
  }

  private actualizarEventosCalendario() {
    this.eventosCalendario = this.listaProgramaciones.map((programacion) => {
      return {
        start: this.convertDate(programacion.fechaHoraInicial + ''),
        title: `
          Inicia: ${(programacion.fechaHoraInicial + '').split('T').join(' ')} -
          Finaliza: ${(programacion.fechaHoraFinal + '')
            .split('T')
            .join(' ')} Solicitud #${
          programacion.codigoSolicitud
        } Programacion #${programacion.idProgramacion}
          `,
        color: {
          primary: programacion.esAgendaTarea ? '#1e90ff' : '#b5b5b5',
          secondary: '#b5b5b5',
        },
      };
    });
  }

  /**
   * @description funcion para convertir a una fecha valida
   * 'yyyy/MM/dd'
   */
  private convertDate(fecha: string): Date {
    const [dia, mes, anio, hora, minutos, segundos] = fecha
      .split('/')
      .join(':')
      .split(' ')
      .join(':')
      .split(':')
      .map((element) => +element);
    return new Date(anio, mes - 1, dia, hora, minutos, segundos);
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    return this.form.controls[campo].hasError('required');
  }

  /**
   * @description valida la fecha final no sea inferior a la inicial
   */
  public isRequiredFechaFinalInferiorInicial(): boolean {
    return this.form.hasError('requiredFechaFinalInferiorInicial');
  }

  /**
   * @description valida las fecha inicial no sea inferior a la actual
   */
  public isRequiredFechaActualMayorInicial(): boolean {
    return this.form.hasError('requiredFechaActualMayorInicial');
  }

  /**
   * @description valida las fecha final no sea inferior a la actual
   */
  public isRequiredFechaActualMayorFinal(): boolean {
    return this.form.hasError('requiredFechaActualMayorFinal');
  }

  /**
   * @description devuelve a pagina anterior
   */
  public cancelar() {
    this.modales.modalCancelar(this.rutaRedireccion);
  }

  /**
   * @description guarda lo que esta en pantalla siempre y cuando cumpla las validaciones
   */
  public guardar(): Observable<boolean> {
    const subject = new Subject<boolean>();
    if (this.isValidForm) {
      this.programacionService
        .actualizarProgramacion({
          idTarea: this.objSol!.idTarea,
          idSolicitudServicio: this.objSol!.idSolicitud,
          fechaHoraFinal: this.transformDate(
            this.form.get('fechaFinal')?.value,
            'dd/MM/yyyy HH:mm:ss'
          )!,
          fechaHoraInicial: this.transformDate(
            this.form.get('fechaInicial')?.value,
            'dd/MM/yyyy HH:mm:ss'
          )!,
          idProgramacion: this.programacionActual
            ? this.programacionActual.idProgramacion
            : null,
          idTipoAudiencia: this.form.get('razon')?.value,
        })
        .subscribe((result) => {
          if (result && result.statusCode === CodigosRespuesta.OK) {
            this.modalMayorDias();
            this.modalAudienciaProgramada().subscribe(() => {
              this.obtenerAudiencias();
              subject.next(true);
            });
          }
        });
    } else {
      subject.next(false);
    }
    return subject.asObservable();
  }

  get isValidForm() {
    if (this.form.invalid) {
      this.mostrarValidaciones = true;
      this.mostrarValidacionesFechas = true;
      return false;
    } else {
      this.mostrarValidaciones = false;
      this.mostrarValidacionesFechas = false;
      return true;
    }
  }

  /**
   * @description mensaje mayor paso mas de 10 dias
   */
  private modalMayorDias() {
    const fechaSeleccionada = new Date(
      this.form.controls['fechaInicial'].value
    );
    let diaEnMils = 1000 * 60 * 60 * 24;
    let resultado = Math.round(
      (fechaSeleccionada.getTime() - new Date().getTime()) / diaEnMils
    );
    if (resultado > 10) {
      this.modales.modalExito(
        'Tenga en cuenta que supera los 10 días hábiles',
        ImagenesModal.EXCLAMACION
      );
    }
  }

  /**
   * @description mensaje informativo de programacion de audiencia
   */
  private modalAudienciaProgramada() {
    const fInicial = this.datePipe.transform(
      this.form.get('fechaInicial')?.value,
      'dd/MM/yyyy HH:mm:ss'
    )!;
    const fFinal = this.datePipe.transform(
      this.form.get('fechaFinal')?.value,
      'dd/MM/yyyy HH:mm:ss'
    )!;
    this.mostrarValidacionesFechas = false;

    return this.modales.modalExito(
      `Audiencia programada para el día: ${fInicial} hasta
      ${fFinal}`
    );
  }

  /**
   * @description Finaliza el proceso y pasa al siguiente
   */
  public cerrarActuacion() {
    this.guardar().subscribe((result) => {
      if (result) {
        this.modales.modalCerrarActuaciones(this.objSol!, this.rutaRedireccion);
      }
    });
  }

  /**
   * @description redirecciona a la ruta casos
   */
  get rutaRedireccion() {
    return '/casos';
  }

  private getIndexRazonAudiencia(idSelecionado: number): number {
    return this.listaTiposProgramacion.findIndex(
      (element) => element.idTipoAudiencia == idSelecionado
    );
  }

  private get getDataPost(): PostDataProgramacionAudiencia {
    const index = this.getIndexRazonAudiencia(this.form.get('razon')?.value);
    return {
      idSolicitud: this.objSol!.idSolicitud,
      idTarea: this.objSol!.idTarea,
      idTarea_uso: 0, ///TODO: cambiar por dinamico
      etiqueta: this.listaTiposProgramacion[index].etiqueta,
      razon: this.listaTiposProgramacion[index].descripcion,
      fechaInicial: this.datePipe.transform(
        this.form.get('fechaInicial')?.value,
        'dd/MM/yyyy HH:mm:ss'
      )!,

      fechaFinal: this.datePipe.transform(
        this.form.get('fechaFinal')?.value,
        'dd/MM/yyyy HH:mm:ss'
      )!,
      usuarioModifica: 4, ///TODO cambiar por dinamico
      estado: 'DISPONIBLE',
    };
  }
}
