import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedFunctions } from 'src/app/shared/functions';
import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';
import { ModalVicAgrComponent } from '../modal-vic-agr/modal-vic-agr.component';
import { SolicitudService } from '../services/solicitud.service';

@Component({
  selector: 'app-involucrados',
  templateUrl: './involucrados.component.html',
  styleUrls: ['./involucrados.component.scss'],
})
export class InvolucradosComponent implements OnInit, OnChanges {
  @Output() passTap2 = new EventEmitter<number>();
  @Input() idSolicitud!: number;

  public victimasForm!: FormGroup;
  public agresoresForm!: FormGroup;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public mostrarValidaciones: boolean = false;
  public maxDate: Date = new Date();
  public listaGenero: DominioInterface[] = [];
  public listaTipoDocumento: DominioInterface[] = [];
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private solicitudService: SolicitudService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSolicitud'] && this.idSolicitud > 0) {
      //consultar los involucrados
    }
  }

  ngOnInit(): void {
    this.cargarForm();

    this.store.select('genero').subscribe(({ genero }) => {
      this.listaGenero = genero;
    });

    this.store.select('tipo_documento').subscribe(({ tipo_documento }) => {
      this.listaTipoDocumento = tipo_documento;
    });
  }

  /**
   * @description carga form de víctima y agresor
   */
  private cargarForm() {
    this.victimasForm = this.fb.group({
      sections: this.fb.array([]),
    });
    this.agresoresForm = this.fb.group({
      sections: this.fb.array([]),
    });
    this.agregarVictima();
    this.agregarAgresor();
    this.consultarCiudadanoInvolucrado();
  }

  get victimas() {
    return this.victimasForm.controls['sections'] as FormArray;
  }

  get agresores() {
    return this.agresoresForm.controls['sections'] as FormArray;
  }

  /**
   * @description Solo permite ingresar numeros
   */
  public soloNumeroV(campo: string) {
    SharedFunctions.soloNumero(campo, this.victimasForm);
  }

  /**
   * @description Solo permite ingresar expresion regular
   */
  public soloLetrasV(campo: string) {
    SharedFunctions.soloLetras(campo, this.victimasForm);
  }

  /**
   * @description Solo permite ingresar numeros
   */
  public soloNumeroA(campo: string) {
    SharedFunctions.soloNumero(campo, this.agresoresForm);
  }

  /**
   * @description Solo permite ingresar expresion regular
   */
  public soloLetrasA(campo: string) {
    SharedFunctions.soloLetras(campo, this.agresoresForm);
  }

  /**
   * @description agrega victimas al formulario
   */
  agregarVictima() {
    let section = this.victimasForm.get('sections') as FormArray;

    section.push(
      this.fb.group(
        {
          primer_nombre: [
            '',
            [Validators.required, Validators.pattern(Regex.ALFA)],
          ],
          segundo_nombre: '',
          primer_apellido: [
            '',
            [Validators.required, Validators.pattern(Regex.ALFA)],
          ],
          segundo_apellido: '',
          id_tipo_documento: ['', Validators.required],
          numero_documento: [
            '',
            [Validators.required, Validators.pattern(Regex.ALFA)],
          ],
          fecha_nacimiento: '',
          genero: '',
          edad: ['', Validators.pattern(Regex.NUMERO)],
          telefono: ['', Validators.pattern(Regex.NUMERO)],
          correo_electronico: ['', Validators.pattern(Regex.EMAIL)],
          localidad: ' ',
          barrio: '',
          direccion: '',
          tipoinvolucrado: true,
          principal: false,
        },
        { updateOn: 'change' }
      )
    );

    this.victimasForm.updateValueAndValidity();
  }

  /**
   * @description agrega agresores al formulario
   */
  public agregarAgresor() {
    let section = this.agresoresForm.get('sections') as FormArray;

    section.push(
      this.fb.group(
        {
          primer_nombre: [
            '',
            [Validators.required, Validators.pattern(Regex.ALFA)],
          ],
          segundo_nombre: '',
          primer_apellido: [
            '',
            [Validators.required, Validators.pattern(Regex.ALFA)],
          ],
          segundo_apellido: '',
          id_tipo_documento: ['', Validators.required],
          numero_documento: [
            '',
            [Validators.required, Validators.pattern(Regex.ALFA)],
          ],
          fecha_nacimiento: '',
          genero: '',
          edad: ['', Validators.pattern(Regex.NUMERO)],
          telefono: ['', Validators.pattern(Regex.NUMERO)],
          correo_electronico: ['', Validators.pattern(Regex.EMAIL)],
          localidad: ' ',
          barrio: '',
          direccion: '',
          tipoinvolucrado: false,
          principal: false,
        },
        { updateOn: 'change' }
      )
    );

    this.agresoresForm.updateValueAndValidity();
  }

  /**
   * @description elimina la última victima agregada del formulario
   */
  public eliminarVictima() {
    let section = this.victimasForm.get('sections') as FormArray;
    section.controls = section.controls.slice(0, section.controls.length - 1);
    section.updateValueAndValidity();
    this.victimasForm.updateValueAndValidity();
  }

  /**
   * @description elimina el último agresor agregado del formulario
   */
  public eliminarAgresor() {
    let section = this.agresoresForm.get('sections') as FormArray;
    section.controls = section.controls.slice(0, section.controls.length - 1);
    section.updateValueAndValidity();
    this.agresoresForm.updateValueAndValidity();
  }

  /**
   * @description filtra solo números
   * @param input entrada
   */
  public formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(Regex.NUMERO, '');
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param formulario instancia del formulario
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(formulario: FormGroup, campo: string): boolean {
    if (formulario.controls[campo]) {
      return formulario.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  /**
   * @description valida que el campo cumpla la expresión regular
   * @param campo campo a validar del form
   * @returns boleano
   */
  public patternValid(formulario: FormGroup, campo: string): boolean {
    if (formulario.controls[campo]) {
      return formulario.controls[campo].hasError('pattern');
    } else {
      return false;
    }
  }

  /**
   * @description llama servicio guardar datos contacto
   */
  guardarDatosContacto() {
    if (this.validarSolicitudExiste()) {
      const sectionV = this.victimasForm.get('sections') as FormArray;
      const sectionA = this.agresoresForm.get('sections') as FormArray;

      if (sectionV.valid && sectionA.valid) {
        this.abrirModalVicAgr();
      } else {
        this.mostrarValidaciones = true;
      }
    } else {
      this.retornarPreguntasOrientadoras();
    }
  }

  /**
   * @description valida que exista la solicitud para registrar los involucrados
   * @returns boleano
   */
  validarSolicitudExiste(): boolean {
    let resultado = false;
    if (sessionStorage.getItem('idC')) {
      resultado = true;
    }
    return resultado;
  }

  /**
   * @description abre modal para seleccionar víctima y agresor principal,
   * luego llamar el servicio de insertar
   */
  abrirModalVicAgr() {
    this.dialog.open(ModalVicAgrComponent, {
      panelClass: 'roundedModal',
      disableClose: true,
      width: '595px',
      height: '470px',
      data: {
        victimas: this.victimasForm.value,
        agresores: this.agresoresForm.value,
      },
    });
  }

  /**
   * @description funcion para calcular la edad del ciudadano
   * @param event resive el evento para calcular la edad
   */
  public calcularEdad(event: MatDatepickerInputEvent<Date>, form: FormGroup) {
    if (event.value) {
      const edad = Math.floor(
        Math.abs(Date.now() - <any>new Date(event.value)) /
          (1000 * 3600 * 24) /
          365
      );
      form.controls['edad'].setValue(edad);
    }
  }

  /**
   * @description llama servicio para consultar víctima principal
   */
  private consultarCiudadanoInvolucrado() {
    const ciudadano = JSON.parse(sessionStorage.getItem('ciudadano')!);
    setTimeout(() => {
      this.solicitudService
        .consultaCiudadanoInvolucrado(ciudadano.idCiudadano)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.armarVictimaPrincipal(data.data);
            }
          },
        });
    }, 1000);
  }

  /**
   * @description llena el form de víctima con la principal
   * @param data objeto con la víctima principal
   */
  private armarVictimaPrincipal(data: any) {
    let section = this.victimasForm.get('sections') as FormArray;
    let fechaSplit = [];
    let fecha: any;
    if (data.fecha_nacimiento) {
      fechaSplit = data.fecha_nacimiento.substring(0, 10).split('-');
      fecha = new Date(fechaSplit[0], fechaSplit[1] - 1, fechaSplit[2]);
    }

    section.controls.forEach((v) => {
      v.get('primer_nombre')?.setValue(data.primer_nombre);
      v.get('segundo_nombre')?.setValue(data.segundo_nombre);
      v.get('primer_apellido')?.setValue(data.primer_apellido);
      v.get('segundo_apellido')?.setValue(data.segundo_apellido);
      v.get('id_tipo_documento')?.setValue(data.id_tipo_documento);
      v.get('numero_documento')?.setValue(data.numero_documento);
      v.get('fecha_nacimiento')?.setValue(fecha);
      v.get('edad')?.setValue(data.edad);
      v.get('genero')?.setValue(+data.genero);
      v.get('telefono')?.setValue(data.telefono);
      v.get('correo_electronico')?.setValue(data.correo_electronico);
      v.get('localidad')?.setValue(data.localidad || ' ');
      v.get('barrio')?.setValue(data.barrio);
      if (data.direccion) {
        v.get('direccion')?.setValue(data.direccion.trim());
      } else {
        v.get('direccion')?.setValue(data.direccion);
      }
      v.get('tipoinvolucrado')?.setValue(true);
      v.get('principal')?.setValue(true);
      v.disable({ onlySelf: true });
    });
  }

  /**
   * @description muestra modal de cancelar solicitud
   */
  public cancelarSolicitud() {
    const ciudadano = JSON.parse(sessionStorage.getItem('ciudadano')!);
    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CANCELAR_SOL,
      this.dialog,
      'assets/images/exclamacion.svg'
    ).subscribe({
      next: (res) => {
        if (!res) {
          this.victimasForm.reset();
          this.agresoresForm.reset();
          this.consultarCiudadanoInvolucrado();
        } else {
          this.router.navigate([
            '../historial-ciudadano',
            ciudadano.idCiudadano,
          ]);
        }
      },
    });
  }

  /**
   * @description envia informacion al contenedor padre
   */
  public retornarPreguntasOrientadoras() {
    this.passTap2.emit(0);
  }
}
