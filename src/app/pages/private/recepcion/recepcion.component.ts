import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Mensajes } from '../../../constants';
import { SharedFunctions } from '../../../shared/functions';
import { Modales } from '../../../shared/modals';
import {
  AuroraActionColumn,
  AuroraTableColumn,
} from '../../../shared/table/table.component';
import { CiudadanoInterface } from '../interfaces/ciudadano.interface';
import { RecepcionService } from '../services/recepcion.service';
import { RecepcionCita } from './interfaces/recepcion.interfaces';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss'],
})
export class RecepcionComponent {
  public columnas: string[] = [
    'codigo',
    'nombre',
    'apellido',
    'documento',
    'hora',
    'fecha',
    'cita',
    'estado',
    'accion',
  ];

  public columns: AuroraTableColumn[] = [
    { name: 'idCita', title: 'código cita' },
    { name: 'nombres', title: 'nombres' },
    { name: 'apellidos', title: 'apellidos' },
    { name: 'numeroDocumento', title: 'No. de Doc' },
    {
      name: 'fechaCita',
      title: 'fecha cita',
      render: (value) => {
        let dateString = this.datePipe.transform(value, 'dd/MM/yyyy');
        return dateString ? dateString : value;
      },
    },
    { name: 'horaCita', title: 'hora cita' },
    { name: 'origenCita', title: 'Tipo de Cita' },
    { name: 'estado', title: 'estado' },
    { name: 'actions', title: 'acciones' },
  ];

  public actions: AuroraActionColumn[] = [
    {
      imagen: 'assets/images/irProceso.svg',
      tooltip: 'Ir al proceso',
      tooltipPosition: 'right',
      accion: (row: RecepcionCita, router) => {
        if (row.idCiudadano && row.apellidos && row.nombres) {
          const ciudadano: CiudadanoInterface = {
            idCiudadano: row.idCiudadano,
            apellidos: row.apellidos,
            nombres: row.nombres,
            numero_documento: row.numeroDocumento,
          };
          sessionStorage.setItem('ciudadano', JSON.stringify(ciudadano));
          router.navigate(['/historial-ciudadano', row.idCiudadano]);
        }
      },
    },
  ];
  
  private user!: UserInterface | undefined;
  public listaRecepcion: RecepcionCita[] = [];
  public consultaRealizada: boolean = false;
  public form: FormGroup;
  public enviarConfirmacionActions: boolean = true;
  
  constructor(
    private recepcionService: RecepcionService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private modales: Modales,
    private authService: AuthService
  ) {
    this.user = this.authService.currentUserValue;
    this.form = this.formBuilder.group({
      nombCiudadano: [''],
      primerApellido: [''],
      segundoApellido: [''],
      numeroDocumento: [''],
      codigoCita: [''],
      fecha: [''],
      estadoCita: [null],
      idComisaria: this.user?.idComisaria
    });
  }

  /**
   * @description obtiene las solicitudes del ciudadano a partir de su id.
   */
  public async getCitas() {
    try {
      let formValue = this.form.value;

      //Comprobamos si se ha ingresado alguno de estos campos
      if (formValue.nombCiudadano || formValue.primerApellido) {
        // Si se han ingresado nombres o primer apellido, deben ingresarse los dos campos de nombre y primer apellido
        if (!(formValue.nombCiudadano && formValue.primerApellido)) {
          this.modales.modalInformacion(
            'Para poder realizar la consulta por nombres o primer apellido, se debe ingresar el nombre y primer apellido.'
          );
          return;
        }
      } else if (formValue.segundoApellido) {
        // Si se han ingresado nombres o primer apellido, deben ingresarse los dos campos de nombre y primer apellido
        if (
          !(
            formValue.nombCiudadano &&
            formValue.primerApellido &&
            formValue.segundoApellido
          )
        ) {
          this.modales.modalInformacion(
            'Para poder realizar la consulta por segundo apellido, se debe ingresar el nombre y primer apellido.'
          );
          return;
        }
      }

      formValue.estadoCita =
        formValue.estadoCita === 'null' ? null : formValue.estadoCita;
      formValue.estadoCita =
        formValue.estadoCita === 'true' ? true : formValue.estadoCita;
      formValue.estadoCita =
        formValue.estadoCita === 'false' ? false : formValue.estadoCita;
      // formateamos los datos
      formValue.nombCiudadano = formValue.nombCiudadano.trim();
      formValue.primerApellido = formValue.primerApellido.trim();
      formValue.segundoApellido = formValue.segundoApellido.trim();
      formValue.fecha = formValue.fecha
        ? this.datePipe.transform(formValue.fecha, 'MM/dd/yyyy HH:mm:ss')
        : '';

      const result = await lastValueFrom(
        this.recepcionService.getCitas(formValue)
      );
      if (!result) {
        this.modales.modalInformacion(
          'No se encontraron solicitudes para este filtro.'
        );
        return;
      }
      if (result.statusCode != 200) {
        this.modales.modalInformacion(result.message);
        return;
      }
      if (!result.data || !result.data.datosPaginados) {
        this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        return;
      }
      this.consultaRealizada = true;
      this.listaRecepcion = Array.isArray(result.data.datosPaginados)
        ? result.data.datosPaginados
        : [];
    } catch (error: any) {
      SharedFunctions.getErrorMessage(error);
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
    }
  }
}
