import {
  AfterViewInit,
  OnChanges,
  Component,
  EventEmitter,
  Output,
  SimpleChanges,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import {
  TipoReportePdf,
  TiposDocumentoCarga,
} from '../../../../../../../constants';
import { ArchivoInterface } from '../../../../../../../interfaces/shared.interfaces';
import { SharedService } from '../../../../../../../services/shared.service';
import { SharedFunctions } from '../../../../../../../shared/functions';
import { Modales } from '../../../../../../../shared/modals';
import { ValoracionRiesgo } from '../../../../../interfaces/psicologia.interface';
import { IdentificacionDelRiesgoService } from '../../../../services/identificacion-del-riesgo.service';

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.scss'],
})
export class ValoracionComponent implements AfterViewInit, OnChanges {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
  @Output() siguienteTab: EventEmitter<'Anterior' | 'Siguiente'> =
    new EventEmitter<'Anterior' | 'Siguiente'>();
  @Output()
  imprimirPDFCompleto = new EventEmitter<string>();


  public valoracion!: ValoracionRiesgo;
  public form: FormGroup;
  public tipoPdf = TipoReportePdf.IDENTIFICACION_RIESGO;
  public tarea = JSON.parse(sessionStorage.getItem('info')!);

  private showIsRequiredOnSubmit: boolean = false;
  public file!: ArchivoInterface;

  constructor(
    private formBuilder: FormBuilder,
    private identificacionService: IdentificacionDelRiesgoService,
    private modales: Modales,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      recomendaciones: ['', [Validators.required]],
      file: [null, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit(): void {
    this.cargarRespuestas();
    this.obtenerArchivoCargado();
  }

  /**
   * @description valida los campos segun el nombre y las condiciones del formulario
   * @param name nombre del campo en el formulario
   * @returns
   */
  public isRequiredField(form: FormGroup, name: string) {
    const dirty = form.get(name)?.dirty;
    const required = SharedFunctions.findInvalidControls(form).includes(name);
    const empty =
      typeof form.get(name)?.value == 'string' && form.get(name)?.value == '';
    if (this.showIsRequiredOnSubmit) {
      return !form.get(name)?.valid || empty;
    }
    return dirty && required ? !form.get(name)?.valid || empty : false;
  }

  cargarRespuestas() {
    this.identificacionService
      .getEvaluacionRiegos(this.tarea.idSolicitud)
      .subscribe((result) => {
        if (result && result.data) {
          this.valoracion = result.data;
          this.form
            .get('recomendaciones')
            ?.setValue(this.valoracion.descripcion);
        }
      });
  }

  anterior() {
    this.postRegistrarRecomendaciones('Anterior');
  }

  guardar() {
    this.postRegistrarRecomendaciones('Guardar');
  }

  cancelar() {
    this.siguientePaso.emit('Cancelar');
  }

  postRegistrarRecomendaciones(accion: 'Siguiente' | 'Anterior' | 'Guardar') {
    if (accion == 'Anterior' && !this.form.get('recomendaciones')?.value) {
      this.siguientePaso.emit('Anterior');
    } else {
      this.identificacionService
        .postRegistrarRecomendaciones({
          idSolicitudServicio: this.tarea.idSolicitud,
          decripcion: this.form.get('recomendaciones')?.value,
        })
        .subscribe((result) => {
          if (result && result.statusCode == 200) {
            this.modales
              .modalExito('Información guardada exitosamente')
              .subscribe(() => {
                if (accion == 'Siguiente') {
                  this.siguienteTab.emit(accion);
                } else if (accion == 'Anterior') {
                  this.siguientePaso.emit('Anterior');
                }
              });
          }
        });
    }
  }

  cargarArchivo(base64: string) {
    if (base64) {
      this.sharedService
        .guardarArchivo({
          idSolicitudServicio: this.tarea.idSolicitud,
          entrada: base64,
          nombrearchivo: null,
          tipoDocumento: TiposDocumentoCarga.IDENTIFICACION_DEL_RIESGO,
        })
        .subscribe(async (result) => {
          if (result && result.statusCode == 200) {
            await this.obtenerArchivoCargado();
            this.modales.modalExito('Archivo cargado exitosamente');
          }
        });
    }
  }

  async obtenerArchivoCargado() {
    const resultConsultar = await lastValueFrom(
      this.sharedService.ConsultarArchivos(
        this.tarea.idSolicitud,
        TiposDocumentoCarga.IDENTIFICACION_DEL_RIESGO
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

  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea, '/psicologia');
  }

  /**
   * @description Imprime PDF completo
   */
  imprimirCompleto() {
    if (this.tarea && this.tarea.idSolicitud) {
      this.imprimirPDFCompleto.emit();
    } else {
      this.modales.modalInformacion(
        'Para imprimir el documento completo debes completar todos los pasos de identificacion del riesgo primero.'
      );
    }
  }
}
