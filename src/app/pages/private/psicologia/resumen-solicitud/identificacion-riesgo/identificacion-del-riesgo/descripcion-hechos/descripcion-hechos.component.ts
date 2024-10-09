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
  public dateMin: Date = new Date(
    new Date().setDate(new Date().getDate() - 3650)
  );

  private tarea = JSON.parse(sessionStorage.getItem('info')!);

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
  /**
   * @description valida los campos segun el nombre y las condiciones del formulario
   * @param name nombre del campo en el formulario
   * @returns
   */
  public isRequiredField(
    form: FormGroup,
    name: string,
    obligatory: boolean = false
  ) {
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

  /**
   * Consulta la información de descripcion  de los hechos
   * @returns
   */
  public async getDescripcionHechos() {
    try {
      const result = await lastValueFrom(
        this.identificacionDelRiesgoService.getDescripcionHechosPorSolicitud(
          this.tarea.idSolicitud
        )
      );
      if (!result) {
        this.modales.modalInformacion('No se encontraron los datosss.');
        return;
      }
      if (result.statusCode != 200) {
        this.modales.modalInformacion(result.message);
        return;
      }
      if (!result.data) {
        this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        return;
      }
      this.formDescripcionHechos
        .get('hora')
        ?.setValue(
          this.datePipe.transform(new Date(result.data.fecha), 'HH:mm')
        );
      this.formDescripcionHechos
        .get('fecha')
        ?.setValue(new Date(result.data.fecha));
      this.formDescripcionHechos
        .get('descripcionHechos')
        ?.setValue(result.data.descripcionHechos);
      this.formDescripcionHechos
        .get('lugarHechos')
        ?.setValue(result.data.lugarHechos);
    } catch (error: any) {
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
    }
  }

  public actualizarDescripcionHechos() {
    const formValue = this.formDescripcionHechos.value;
    const body = {
      descripcionHechos: formValue.descripcionHechos,
      fecha: this.datePipe.transform(formValue.fecha, 'MM-dd-yyyy'),
      hora: formValue.hora,
      idSolicitudServicio: this.tarea.idSolicitud,
      lugarHechos: formValue.lugarHechos,
    };
    return lastValueFrom(
      this.identificacionDelRiesgoService.actualizarDescripcionHechosPorSolicitud(
        body
      )
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
    //Insertar aquí las acciones a realizar.

    if (this.isValidForm()) {
      this.showOnSubmitIsRequired = false;
      await this.actualizarDescripcionHechos()
        .then((success) => {
          if (success.statusCode == 200) this.siguientePaso.emit('Siguiente');
        })
        .catch(() => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        });
    } else {
      this.showOnSubmitIsRequired = true;
    }
  }

  public camposObligatorios: string[] = [];
  public showOnSubmitIsRequired: boolean = false;

  /**
   * @description valida si el formulario es válido
   * @param formulario
   * @returns
   */
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
    camposRequeridos = SharedFunctions.findInvalidControls(
      this.formDescripcionHechos
    ).concat(validarCamposObligatorios(this.formDescripcionHechos));
    return this.formDescripcionHechos.valid && !camposRequeridos.length;
  }
}
