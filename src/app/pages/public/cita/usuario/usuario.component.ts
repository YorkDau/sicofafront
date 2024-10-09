import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';
import { CitaInterface } from '../../interfaces/cita.interface';
import { ComisariaInterface } from '../../interfaces/comisaria.interface';
import { ComisariaService } from '../../services/comisaria.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [DatePipe],
})
export class UsuarioComponent implements OnInit {
  public userForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgCorreoInv: string = Mensajes.MENSAJE_CORREO_INV;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;
  public listaTiposDocumentos: DominioInterface[] = [];

  private Regex = Regex;
  private listaTipoAtencion: number[] = [];
  private objComisaria!: ComisariaInterface;
  private objCita!: CitaInterface;
  private idhoraCita: number = 0;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private comisariaService: ComisariaService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarForm();

    this.store
      .select('comisaria')
      .subscribe(({ comisaria }) => (this.objComisaria = comisaria!));
    this.store.select('horario').subscribe(({ horario, idhoraCita }) => {
      this.objCita = horario!;
      this.idhoraCita = idhoraCita;
    });
    this.store
      .select('tipo_documento')
      .subscribe(
        ({ tipo_documento }) => (this.listaTiposDocumentos = tipo_documento)
      );
  }

  /**
   * @description carga form
   */
  private cargarForm() {
    this.userForm = this.fb.group({
      idCiudadMunicipio: 0,
      idComisaria: 0,
      fechaCita: ['', Validators.required],
      horacita: ['', Validators.required],
      nombCiudadano: [
        '',
        [Validators.required, Validators.pattern(Regex.TEXTO)],
      ],
      primerApellido: [
        '',
        [Validators.required, Validators.pattern(Regex.TEXTO)],
      ],
      segundoApellido: '',
      tipoDocumento: ['', Validators.required],
      numeroDocumento: [
        '',
        [Validators.required, Validators.pattern(Regex.ALFA)],
      ],
      direccResidencia: ['', Validators.required],
      telf: '',
      celular: '',
      correoElectronico: ['', Validators.pattern(Regex.EMAIL)],
      datos: [false, Validators.requiredTrue],
      violenciaFisica: false,
      violenciaPsico: false,
      violenciaSex: false,
      violenciaPat: false,
      violenciaEco: false,
      coercion: false,
      tipoAtencionList: ['', Validators.required],
      idCita: '',
      contacto: ['', Validators.required],
    });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.userForm.controls[campo]) {
      return this.userForm.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  /**
   * @description valida que el campo cumpla la expresión regular
   * @param campo campo a validar del form
   * @returns boleano
   */
  public patternValid(campo: string): boolean {
    if (this.userForm.controls[campo]) {
      return this.userForm.controls[campo].hasError('pattern');
    } else {
      return false;
    }
  }

  /**
   * @description llama servicio de crear cita
   */
  public crearCita() {
    this.armarForm();

    if (this.userForm.valid) {
      this.mostrarValidaciones = false;
      this.comisariaService.crearCita(this.userForm.value).subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            const comisaria = data.data.datosPaginados.nombComisaria;
            const fecha = data.data.datosPaginados.fechacita;
            const hora = data.data.datosPaginados.horacita;

            const mensaje = `${Mensajes.MENSAJE_EXITO_CITA}
              <div class='message-modal-success'>${comisaria} a las ${hora} de ${fecha}</div>`;

            Modales.modalExito(mensaje, 'assets/images/check.svg', this.dialog);
            this.router.navigate(['/public']);
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR,
            this.dialog,
            'assets/images/exclamacion.svg'
          );
        },
      });
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description termina de armar form para inserción
   */
  private armarForm() {
    if (this.objCita.citaHorasList) {
      const hora = this.objCita.citaHorasList.find(
        (h) => h.idCita === this.idhoraCita
      );

      this.userForm.patchValue({
        idCiudadMunicipio: this.objComisaria.idCiudadMunicipio,
        idComisaria: this.objComisaria.comisariaID,
        fechaCita: this.datePipe.transform(
          this.objCita.fechaCita,
          'yyyy-MM-dd'
        ),
        horacita: hora?.horaCita,
        tipoAtencionList: this.listaTipoAtencion,
        idCita: hora?.idCita,
      });

      this.validarDatosContacto();
    }
  }

  /**
   * @description arma array de tipos de atención
   * @param e event
   */
  public armarArrayTipoAtencion(e: any) {
    const id = +e.target.value;

    if (e.target.checked) {
      this.listaTipoAtencion.push(id);
    } else {
      this.listaTipoAtencion = this.listaTipoAtencion.filter((t) => t !== id);
    }
  }

  /**
   * @description valida que al menos esté lleno al menos un campo de datos de contacto
   */
  public validarDatosContacto() {
    const { telf, celular, correoElectronico } = this.userForm.value;
    if (telf || celular || correoElectronico) {
      this.userForm.controls['contacto'].setValue('ok');
    } else {
      this.userForm.controls['contacto'].setValue(null);
    }
  }
}
