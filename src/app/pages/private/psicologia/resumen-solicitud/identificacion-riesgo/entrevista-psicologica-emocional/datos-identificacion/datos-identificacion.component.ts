import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mensajes } from '../../../../../../../constants';
import { SharedFunctions } from '../../../../../../../shared/functions';
import { Modales } from '../../../../../../../shared/modals';
import { DatePipe } from '@angular/common';
import { EntrevistaPsicologicaEmocionalService } from '../../../../services/entrevista-psicologica-emocional.service';
import { ActualizarDatosIdentificacionInterface } from '../../../../../interfaces/psicologia.interface';

@Component({
  selector: 'app-datos-identificacion',
  templateUrl: './datos-identificacion.component.html',
  styleUrls: ['./datos-identificacion.component.scss'],
})
export class DatosIdentificacionComponent {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  public form: FormGroup;
  public dateMax: Date = new Date();
  public dateMin: Date = new Date(
    new Date().setDate(new Date().getDate() - 30)
  ); //Fecha de hace 30 dias
  private involucrado: any;

  public camposObligatorios: string[] = [];
  public showOnSubmitIsRequired: boolean = false;

  constructor(
    private modales: Modales,
    private formBuilder: FormBuilder,
    private entrevistaServices: EntrevistaPsicologicaEmocionalService,
    private datePipe: DatePipe
  ) {
    this.form = this.formBuilder.group({
      fechaEntrevista: [this.dateMax, [Validators.required]],
      fechaInforme: [this.dateMax],
      nombres: [{ value: '', disabled: true }],
      apellidos: [{ value: '', disabled: true }],
      tipoDocumento: [{ value: '', disabled: true }],
      numeroDocumento: [{ value: '', disabled: true }],
      fechaNacimiento: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }],
      eps: [{ value: '', disabled: true }],
      escolaridad: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      barrio: [{ value: '', disabled: true }],
      nombreContacto: ['', Validators.required],
      telefonoContacto: ['', Validators.required],
      direccionContacto: [''],
    });
  }

  ngAfterViewInit(): void {
    this.getInitialData();
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
  public getInitialData() {
    this.entrevistaServices
      .getDatosIdentificacion(this.tarea.idSolicitud)
      .subscribe((result) => {
        if (result && result.statusCode == 200 && result.data) {
          this.involucrado = { ...result.data };
          this.form
            .get('nombres')
            ?.setValue(
              this.involucrado.nombres ? this.involucrado.nombres : ''
            );
          this.form
            .get('apellidos')
            ?.setValue(
              this.involucrado.apellidos ? this.involucrado.apellidos : ''
            );
          this.form
            .get('tipoDocumento')
            ?.setValue(
              this.involucrado.tipoDocumento
                ? this.involucrado.tipoDocumento
                : ''
            );
          this.form
            .get('numeroDocumento')
            ?.setValue(
              this.involucrado.numeroDocumento
                ? this.involucrado.numeroDocumento
                : ''
            );
          this.form
            .get('fechaNacimiento')
            ?.setValue(
              this.involucrado.fechaNacimiento
                ? this.datePipe.transform(
                    this.involucrado.fechaNacimiento,
                    'dd/MM/yyyy'
                  )
                : ''
            );
          this.form
            .get('edad')
            ?.setValue(this.involucrado.edad ? this.involucrado.edad : '');
          this.form
            .get('eps')
            ?.setValue(this.involucrado.eps ? this.involucrado.eps : '');
          this.form
            .get('escolaridad')
            ?.setValue(
              this.involucrado.escolaridad ? this.involucrado.escolaridad : ''
            );
          this.form
            .get('telefono')
            ?.setValue(
              this.involucrado.telefono ? this.involucrado.telefono : ''
            );
          this.form
            .get('direccion')
            ?.setValue(
              this.involucrado.direccion ? this.involucrado.direccion : ''
            );
          this.form
            .get('barrio')
            ?.setValue(this.involucrado.barrio ? this.involucrado.barrio : '');
        }
      });
    this.entrevistaServices
      .getEvaluacionPsicologicaEntrevista(this.tarea.idSolicitud)
      .subscribe((result) => {
        if (result && result.statusCode == 200 && result.data) {
          this.involucrado = { ...result.data, ...this.involucrado };
          this.form
            .get('fechaEntrevista')
            ?.setValue(
              this.involucrado.fechaEntrevista
                ? this.involucrado.fechaEntrevista
                : ''
            );
          this.form
            .get('fechaInforme')
            ?.setValue(
              this.involucrado.fechaElaboracionInforme
                ? this.involucrado.fechaElaboracionInforme
                : ''
            );
          this.form
            .get('nombreContacto')
            ?.setValue(
              this.involucrado.nombreContacto
                ? this.involucrado.nombreContacto
                : ''
            );
          this.form
            .get('telefonoContacto')
            ?.setValue(
              this.involucrado.telefonoContacto
                ? this.involucrado.telefonoContacto
                : ''
            );
          this.form
            .get('direccionContacto')
            ?.setValue(
              this.involucrado.direccionContacto
                ? this.involucrado.direccionContacto
                : ''
            );
        }
      });
  }

  public actualizar() {
    const formValue = this.form.value;
    const body: ActualizarDatosIdentificacionInterface = {
      idSolicitudServicio: this.tarea.idSolicitud,
      fechaElaboracionInforme: this.datePipe.transform(
        formValue.fechaInforme,
        'yyyy-MM-dd'
      )!,
      fechaEntrevista: this.datePipe.transform(
        formValue.fechaEntrevista,
        'yyyy-MM-dd'
      )!,
      idInvolucrado: this.involucrado.idInvolucrado,
      nombreContacto: formValue.nombreContacto,
      telefonoContacto: formValue.telefonoContacto,
      direccionContacto: formValue.direccionContacto,
    };
    return this.entrevistaServices.actualizarDatosIdentificacion(body);
  }

  cancelar() {
    this.siguientePaso.emit('Cancelar');
  }

  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea, '/psicologia');
  }

  guardar() {
    //Insertar aquí las acciones a realizar.
    if (this.isValidForm()) {
      this.showOnSubmitIsRequired = false;
      this.actualizar().subscribe({
        next: (result) => {
          if (result && result.statusCode == 200) {
            this.siguientePaso.emit('Siguiente');
          }
        },
        error: () => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        },
      });
    } else {
      this.showOnSubmitIsRequired = true;
    }
  }

  /**
   * @description valida si el formulario es válido
   * @param formulario
   * @returns
   */
  isValidForm(): boolean {
    let camposRequeridos: string[];
    let errorHijos = 0;
    const validarCamposObligatorios = (form: FormGroup) => {
      let temp: string[] = [];
      this.camposObligatorios.forEach((name) => {
        if (this.isRequiredField(form, name, true)) {
          if (name == 'ips' || name == 'eps') {
            //dont push it
            if (form.get('seguridad')?.value) {
              //only push if 'seguridad' is true
              temp.push(name);
            }
          } else {
            temp.push(name);
          }
        }
      });
      return temp;
    };
    camposRequeridos = SharedFunctions.findInvalidControls(this.form).concat(
      validarCamposObligatorios(this.form)
    );
    return this.form.valid && !camposRequeridos.length && !errorHijos;
  }
}
