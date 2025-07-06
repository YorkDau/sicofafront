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

private parseFecha(fechaStr: string): Date | null {
  const formatoCorrecto = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

  if (formatoCorrecto.test(fechaStr)) {
    const [, diaStr, mesStr, anioStr] = fechaStr.match(formatoCorrecto)!;
    const dia = Number(diaStr);
    const mes = Number(mesStr);
    const anio = Number(anioStr);

    const esFechaValida =
      dia >= 1 && dia <= 31 &&
      mes >= 1 && mes <= 12 &&
      anio >= 1900 && anio <= 3000;

    return esFechaValida ? new Date(anio, mes - 1, dia) : null;
  }

  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return null;

  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();

  const nuevaFechaStr = `${dia}/${mes}/${anio}`;

  return this.parseFecha(nuevaFechaStr);
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
    const fechaParseada = this.parseFecha(fechaOriginal);

    if (!fechaParseada) {
      this.modales.modalInformacion('La fecha recibida es inválida.');
      return;
    }
    console.log('Fecha parseada:', fechaParseada);
    console.log('Hora original:', result.data.hora);
    console.log('Hora transformada:', this.datePipe.transform(fechaParseada, 'HH:mm'));
    

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
