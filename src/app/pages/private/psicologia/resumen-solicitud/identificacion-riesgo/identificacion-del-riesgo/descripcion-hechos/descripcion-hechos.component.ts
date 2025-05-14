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
  public camposObligatorios: string[] = [];
  public showOnSubmitIsRequired: boolean = false;

  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  constructor(
    private modales: Modales,
    private formBuilder: FormBuilder,
    private identificacionDelRiesgoService: IdentificacionDelRiesgoService,
    private datePipe: DatePipe
  ) {
    this.formDescripcionHechos = this.formBuilder.group({
      fecha: [new Date(), [Validators.required]],
      hora: [this.datePipe.transform(new Date(), 'HH:mm'), [Validators.required]],
      descripcionHechos: ['', [Validators.required]],
      lugarHechos: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.getDescripcionHechos();
  }

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

  public async getDescripcionHechos() {
    try {
      const result = await lastValueFrom(
        this.identificacionDelRiesgoService.getDescripcionHechosPorSolicitud(
          this.tarea.idSolicitud
        )
      );
      
      if (!result) {
        this.modales.modalInformacion('No se encontraron los datos.');
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

      // Parsear la fecha y hora correctamente
      const fechaData = this.parseFechaFromAPI(result.data.fecha);
      const horaData = this.parseHoraFromAPI(result.data.hora);

      // Asignar valores al formulario
      this.formDescripcionHechos.patchValue({
        fecha: fechaData || new Date(),
        hora: horaData || this.datePipe.transform(new Date(), 'HH:mm'),
        descripcionHechos: result.data.descripcionHechos || '',
        lugarHechos: result.data.lugarHechos || ''
      });
      
    } catch (error: any) {
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
    }
  }

  private parseFechaFromAPI(fechaString: string): Date | null {
    if (!fechaString) return null;
    
    try {
      // Eliminar la parte de tiempo si existe
      const datePart = fechaString.split(' ')[0];
      const parts = datePart.split('/');
      
      // Asegurarse que el formato es día/mes/año
      if (parts.length !== 3) return null;
      
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Los meses en Date son 0-based
      const year = parseInt(parts[2], 10);
      
      // Validar que los valores sean números válidos
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
      
      // Crear y validar la fecha
      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  private parseHoraFromAPI(horaString: string): string | null {
    if (!horaString) return null;
    
    try {
      // Extraer solo la parte HH:MM:SS
      const timePart = horaString.split(' ')[0];
      const parts = timePart.split(':');
      
      if (parts.length < 2) return null;
      
      // Formatear a HH:MM
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    } catch {
      return null;
    }
  }

  public actualizarDescripcionHechos() {
    const formValue = this.formDescripcionHechos.value;
    
    // Formatear fecha para el API (ajusta el formato según lo que espere tu backend)
    const fechaFormateada = formValue.fecha 
      ? this.datePipe.transform(formValue.fecha, 'dd/MM/yyyy') 
      : null;
    
    const body = {
      descripcionHechos: formValue.descripcionHechos || '',
      fecha: fechaFormateada,
      hora: formValue.hora || '',
      idSolicitudServicio: this.tarea.idSolicitud,
      lugarHechos: formValue.lugarHechos || ''
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
  }

  async guardar() {
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
      this.modales.modalInformacion('Por favor diligencie los campos requeridos');
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
    camposRequeridos = SharedFunctions.findInvalidControls(
      this.formDescripcionHechos
    ).concat(validarCamposObligatorios(this.formDescripcionHechos));
    return this.formDescripcionHechos.valid && !camposRequeridos.length;
  }
}