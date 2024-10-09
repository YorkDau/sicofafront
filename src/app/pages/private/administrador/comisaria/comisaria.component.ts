import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  Regex,
} from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';
import {
  DepartamentoInterface,
  MunicipioInterface,
} from '../../interfaces/ciudadano.interface';
import { ComisariaService } from './service/comisaria.service';

@Component({
  selector: 'app-comisaria',
  templateUrl: './comisaria.component.html',
  styles: [],
})
export class ComisariaComponent implements OnInit, OnDestroy {
  public registroForm!: FormGroup;

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgCorreoInv: string = Mensajes.MENSAJE_CORREO_INV;
  public mostrarValidaciones: boolean = false;
  public listaDepto: DepartamentoInterface[] = [];
  public listaCiudad: MunicipioInterface[] = [];
  public listaTipoDocumento: DominioInterface[] = [];
  public titulo: string = 'REGISTRO COMISARÍA';
  public objComisaria!: any;

  private tipoDocumentoSub!: Subscription;
  private departamentoSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private sharedService: SharedService,
    private comisariaService: ComisariaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.departamentoSub.unsubscribe();
    this.tipoDocumentoSub.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarForm();
    this.cargarDepartamento();
    this.cargarTipoDocumento();
    this.cargarFormEdicion();
  }

  /**
   * @description inicializa formulario
   */
  private cargarForm(): void {
    this.registroForm = this.fb.group({
      idComisaria: 0,
      idCiudadMunicipio: [0, Validators.min(1)],
      departamento: [0, Validators.min(1)],
      codigoComisaria: [
        '',
        [Validators.required, Validators.pattern(Regex.ALFA)],
      ],
      nombreComisaria: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.pattern(Regex.EMAIL)]],
      comisario: this.fb.array([]),
      naturaleza: '',
      modalidad: '',
    });
    if (!sessionStorage.getItem('comisario')) this.comisarioForm();
  }

  get comisario() {
    return this.registroForm.controls['comisario'] as FormArray;
  }

  /**
   * @description inicializa formulario para comisario
   */
  private comisarioForm(): void {
    let comisario = this.registroForm.controls['comisario'] as FormArray;

    comisario.push(
      this.fb.group({
        idDocumento: [10, Validators.min(1)],
        nombres: ['', Validators.required],
        apellido: ['', Validators.required],
        numeroDocumento: ['', Validators.required],
        correoElectronico: [
          '',
          [Validators.required, Validators.pattern(Regex.EMAIL)],
        ],
        telefonoFijo: '',
        celular: ['', Validators.required],
      })
    );
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   * @param formulario objeto formulario
   */
  public isRequired(campo: string, formulario: FormGroup): boolean {
    if (formulario.controls[campo]) {
      return formulario.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  /**
   * @description llama servicio que guarda o edita las comisarías
   */
  public guardarComisaria(): void {
    const objComisaria = JSON.parse(sessionStorage.getItem('comisaria')!);

    if (this.validarGuardar(objComisaria)) {
      if (objComisaria) {
        this.actualizarComisaria();
      } else {
        this.iniciarComisaria();
      }
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description valida que el formulario sea correcto para insertar y editar
   * @param objComisaria formulario
   * @returns booleano true correcto, false erroneo
   */
  private validarGuardar(objComisaria: any): boolean {
    let resultado = false;
    if (objComisaria) {
      if (this.registroForm.valid) {
        resultado = true;
      }
    } else {
      const comisarioForm = this.registroForm.get('comisario') as FormArray;
      if (this.registroForm.valid && comisarioForm.valid) resultado = true;
    }

    return resultado;
  }

  /**
   * @description carga llama servicio que carga las ciudades
   * @param idDepto id del depto
   * @param valor true limpia el control del formulario
   */
  public cargarCiudades(idDepto: number, valor: boolean): void {
    this.sharedService
      .getCiudades(idDepto)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaCiudad = data.data;
          if (valor)
            this.registroForm.controls['idCiudadMunicipio'].setValue(0);
        }
      });
  }

  /**
   * @description llena lista departamento del state
   */
  private cargarDepartamento(): void {
    this.departamentoSub = this.store
      .select('departamento')
      .subscribe(({ departamento }) => {
        this.listaDepto = departamento;
      });
  }

  /**
   * @description carga del state el tipo del documento
   */
  private cargarTipoDocumento(): void {
    this.tipoDocumentoSub = this.store
      .select('tipo_documento')
      .subscribe(({ tipo_documento }) => {
        this.listaTipoDocumento = tipo_documento.filter(
          (v) => v.codigo === 'CC'
        );
      });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   * @param formulario objeto formulario
   */
  public isMin(campo: string, formulario: FormGroup): boolean {
    if (formulario.controls[campo]) {
      return formulario.controls[campo].hasError('min');
    } else {
      return false;
    }
  }

  /**
   * @description valida que el campo cumpla la expresión regular
   * @param campo campo a validar del form
   * @param formulario objeto formulario
   * @returns boleano
   */
  public patternValid(campo: string, formulario: FormGroup): boolean {
    if (formulario.controls[campo]) {
      return formulario.controls[campo].hasError('pattern');
    } else {
      return false;
    }
  }

  /**
   * @description llena campos para edición del formulario
   */
  private cargarFormEdicion(): void {
    this.objComisaria = JSON.parse(sessionStorage.getItem('comisaria')!);

    if (this.objComisaria) {
      this.titulo = 'EDICIÓN COMISARÍA';
      this.registroForm.patchValue({
        idComisaria: this.objComisaria.idComisaria,
        idCiudadMunicipio: this.objComisaria.idCiudadMunicipio,
        departamento: this.objComisaria.idDepartamento,
        codigoComisaria: this.objComisaria.codigoComisaria,
        nombreComisaria: this.objComisaria.nombreComisaria,
        direccion: this.objComisaria.direccion,
        telefono: this.objComisaria.telefono,
        correo: this.objComisaria.correo,
        modalidad: this.objComisaria.modalidad,
        naturaleza: this.objComisaria.naturaleza,
      });
      this.registroForm.removeControl('comisario');
      this.registroForm.controls['codigoComisaria'].disable();
      this.cargarCiudades(this.objComisaria.idDepartamento, false);
    }
  }

  /**
   * @description llama servicio que inserta comisaría
   */
  private iniciarComisaria(): void {
    const comisario = this.registroForm.controls['comisario'].value[0];
    const objSinComisaria = (({ comisario, ...o }) => o)(
      this.registroForm.value
    );
    const objInsertar = { ...objSinComisaria, comisario };

    this.comisariaService.iniciarComisaria(objInsertar).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_OK,
            ImagenesModal.OK,
            this.dialog
          );
          this.redireccionar();
        } else {
          this.modalError(data.message);
        }
      },
      error: (data: any) => {
        this.modalError(data);
      },
    });
  }

  /**
   * @description muestra modal error
   * @param mensaje mensaje a mostrar
   */
  private modalError(mensaje?: string): void {
    Modales.modalInformacion(
      mensaje ? mensaje : Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }

  /**
   * @description llama servicio que edita comisaría
   */
  private actualizarComisaria(): void {
    this.comisariaService
      .actualizarComisaria(this.registroForm.value)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_OK,
              ImagenesModal.OK,
              this.dialog
            );
            this.redireccionar();
          } else {
            this.modalError(data.message);
          }
        },
        error: () => {
          this.modalError();
        },
      });
  }

  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar(): void {
    this.router.navigate(['../administrador/listado-comisarias']);
  }
}
