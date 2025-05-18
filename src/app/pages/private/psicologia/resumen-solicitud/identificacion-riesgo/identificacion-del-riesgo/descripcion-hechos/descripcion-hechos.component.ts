import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Mensajes } from '../../../../../../../constants';
import { SharedFunctions } from '../../../../../../../shared/functions';
import { Modales } from '../../../../../../../shared/modals';
import { IdentificacionDelRiesgoService } from '../../../../services/identificacion-del-riesgo.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-descripcion-hechos',
  templateUrl: './descripcion-hechos.component.html',
  styleUrls: ['./descripcion-hechos.component.scss'],
})
export class DescripcionHechosComponent implements AfterViewInit {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();

  public formDescripcionHechos: FormGroup;
  public dateMax: Date = new Date();
  public dateMin: Date = new Date(new Date().setDate(new Date().getDate() - 3650));

  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  public camposObligatorios: string[] = [];
  public showOnSubmitIsRequired: boolean = false;

  constructor(
    private modales: Modales,
    private formBuilder: FormBuilder,
    private identificacionDelRiesgoService: IdentificacionDelRiesgoService,
    private datePipe: DatePipe
  ) {
    this.formDescripcionHechos = this.formBuilder.group({
      fecha: [null, [Validators.required]],
      hora: [null, [Validators.required]],
      descripcionHechos: ['', [Validators.required]],
      lugarHechos: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.getDescripcionHechos();
  }

  public isRequiredField(form: FormGroup, name: string, obligatory: boolean = false) {
    if (obligatory && !this.camposObligatorios.includes(name))
      this.camposObligatorios.push(name);
    const dirty = form.get(name)?.dirty;
    const required = SharedFunctions.findInvalidControls(form).includes(name);
    const empty =
      typeof form.get(name)?.value == 'string' && form.get(name)?.value == '';
    if (obligatory) {
      return dirty && empty;
    }
    if (this.showOnSubmitIsRequired) {
      return !form.get(name)?.valid || empty;
    }
    return dirty && required ? !form.get(name)?.valid || empty : false;
  }

private parseFechaString(fechaStr: string): Date | null {
  const fechaRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM|am|pm)?)?$/;
  const match = fechaStr.match(fechaRegex);
  if (!match) return null;

  let parte1 = Number(match[1]);
  let parte2 = Number(match[2]);
  const anio = Number(match[3]);
  let hora = match[4] ? Number(match[4]) : 0;
  const minutos = match[5] ? Number(match[5]) : 0;
  const segundos = match[6] ? Number(match[6]) : 0;
  const ampm = match[7]?.toUpperCase();
  let dia, mes;
  if (parte1 > 12) {
    dia = parte1;
    mes = parte2;
  } else if (parte2 > 12) {
    dia = parte2;
    mes = parte1;
  } else {
    dia = parte1;
    mes = parte2;
  }

  if (
    dia < 1 || dia > 31 ||
    mes < 1 || mes > 12 ||
    anio < 1900 || anio > 3000 ||
    hora < 0 || hora > 12 ||
    minutos < 0 || minutos > 59 ||
    segundos < 0 || segundos > 59
  ) {
    return null;
  }

  if (ampm) {
    if (ampm === 'PM' && hora < 12) hora += 12;
    if (ampm === 'AM' && hora === 12) hora = 0;
  }

  return new Date(anio, mes - 1, dia, hora, minutos, segundos);
}


public async getDescripcionHechos() {
  try {
    const result = await lastValueFrom(
      this.identificacionDelRiesgoService.getDescripcionHechosPorSolicitud(
        this.tarea.idSolicitud
      )
    );

    if (!result?.data || result.statusCode !== 200) {
      this.modales.modalInformacion(result?.message || Mensajes.MENSAJE_ERROR_G);
      return;
    }

    const fechaOriginal = result.data.fecha;
    const fechaParseada = this.parseFechaString(fechaOriginal);

    if (!fechaParseada) {
      this.modales.modalInformacion('La fecha recibida es inválida.');
      return;
    }

    this.formDescripcionHechos.patchValue({
      fecha: fechaParseada,
      hora: this.datePipe.transform(fechaParseada, 'HH:mm'),
      descripcionHechos: result.data.descripcionHechos || '',
      lugarHechos: result.data.lugarHechos || '',
    });
  } catch (error) {
    this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
  }
}


  public actualizarDescripcionHechos() {
    const formValue = this.formDescripcionHechos.value;

    const fechaFormateada = this.datePipe.transform(formValue.fecha, 'yyyy-MM-dd');

    const body = {
      descripcionHechos: formValue.descripcionHechos,
      fecha: fechaFormateada,
      hora: formValue.hora,
      idSolicitudServicio: this.tarea.idSolicitud,
      lugarHechos: formValue.lugarHechos,
    };

    return lastValueFrom(
      this.identificacionDelRiesgoService.actualizarDescripcionHechosPorSolicitud(body)
    );
  }

  cancelar() {
    this.siguientePaso.emit('Cancelar');
  }

  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea, '/psicologia');
    this.modales.modalInformacion('Por favor diligencie los campos requeridos');
  }

  async guardar() {
    console.log("Guardando datos...");
    if (this.isValidForm()) {
      console.log("Formulario válido, guardando...");
      this.showOnSubmitIsRequired = false;
      await this.actualizarDescripcionHechos()
        .then((success) => {
          if (success.statusCode == 200) this.siguientePaso.emit('Siguiente');
        })
        .catch(() => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        });
    } else {
      console.log(this.formDescripcionHechos);
      console.log(this.camposObligatorios);
      this.showOnSubmitIsRequired = true;
    }
  }

  isValidForm(): boolean {
    let camposRequeridos: string[];
    const validarCamposObligatorios = (form: FormGroup) => {
      let temp: string[] = [];
      this.camposObligatorios.forEach((name) => {
        if (this.isRequiredField(form, name, true)) {
          temp.push(name);
        }
      });
      return temp;
    };
    camposRequeridos = SharedFunctions.findInvalidControls(this.formDescripcionHechos)
      .concat(validarCamposObligatorios(this.formDescripcionHechos));
    return this.formDescripcionHechos.valid && !camposRequeridos.length;
  }
}
