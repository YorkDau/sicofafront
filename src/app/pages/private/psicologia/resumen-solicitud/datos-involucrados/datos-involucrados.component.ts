import { StepperOrientation } from '@angular/cdk/stepper';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { CodigosRespuesta, Mensajes, Regex } from '../../../../../constants';
import { RecepcionCasosInterface } from '../../../../../interfaces/recepcion-casos.interface';
import { SharedService } from '../../../../../services/shared.service';
import { SharedFunctions } from '../../../../../shared/functions';
import { Modales } from '../../../../../shared/modals';
import {
  DominioInterface,
  LugarExpedicionInterface,
} from '../../../interfaces/ciudadano.interface';
import { ActualizacionInvolucrado } from '../../interfaces/actualizacion-involucrado.interface';
import {
  HijoInvolucrado,
  InvolucradoDTO,
} from '../../interfaces/involucrado.interface';
import { IdentificacionDelRiesgoService } from '../../services/identificacion-del-riesgo.service';

@Component({
  selector: 'app-datos-involucrados',
  templateUrl: './datos-involucrados.component.html',
  styleUrls: ['./datos-involucrados.component.scss'],
})
export class DatosInvolucradosComponent implements AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  public orientation: StepperOrientation = 'horizontal';

  public dateMax: Date = new Date();
  public dateMin: Date = new Date(
    new Date().setDate(new Date().getDate() - 54750)
  ); //Fecha de hace 30 dias
  public tarea: RecepcionCasosInterface = JSON.parse(
    sessionStorage.getItem('info')!
  );

  public agresor!: InvolucradoDTO;
  public victima!: InvolucradoDTO;

  public formAgresor: FormGroup;
  public formVictima: FormGroup;

  public formHijosVictima: FormGroup[] = [];
  public formHijosAgresor: FormGroup[] = [];

  public listaTipoDocumento!: DominioInterface[];
  public listaLugarExpedicion!: LugarExpedicionInterface[];
  public listaSexo!: DominioInterface[];
  public listaGenero!: DominioInterface[];
  public listaNivelAcademico!: DominioInterface[];
  public listaDiscapacidad!: DominioInterface[];
  public listaCultura!: DominioInterface[];
  public listaTipoRelacion!: DominioInterface[];

  public listaEstadoCivil!: DominioInterface[];
  public listaOtros!: DominioInterface[];

  public camposObligatorios: string[] = [];
  public showOnSubmitIsRequiredVictima: boolean = false;
  public showOnSubmitIsRequiredAgresor: boolean = false;

  constructor(
    private modales: Modales,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private identificacionDelRiesgoService: IdentificacionDelRiesgoService,
    private title: Title,
    private router: Router
  ) {
    this.title.setTitle(
      'SICOFA - Información de involucrados - Actualizar información de involucrados'
    );
    if (window.screen.width <= 768) {
      this.orientation = 'vertical';
    } else {
      this.orientation = 'horizontal';
    }

    this.formAgresor = this.formBuilder.group({
      primerNombre: [{ value: '', disabled: false }, Validators.required],
      segundoNombre: [{ value: '', disabled: false }],
      primerApellido: [{ value: '', disabled: false }, Validators.required],
      segundoApellido: [{ value: '', disabled: false }],
      fechaNacimiento: [{ value: '', disabled: false }],
      tipoDocumento: [{ value: '', disabled: false }],
      numeroDocumento: [{ value: '', disabled: false }],
      sexo: [{ value: '', disabled: false }, Validators.required],
      identidadGenero: [{ value: '', disabled: false }],
      idEscolaridad: [''],
      ocupacion: [''],
      numeroHijos: [0],
      cultura: [''],
      hijos: [
        [
          {
            custodia: 0,
            edad: 0,
            sexo: 0,
          } as HijoInvolucrado,
        ],
      ],
      descripcionOrganizacionCriminal: [''],
      agresorOrganizacionCriminal: [false],
      edadAproximadaAgresor: [],
      lugarExpedicion: [{ value: '', disabled: false }, [Validators.required]],
      fechaExpedicion: [{ value: '', disabled: false }, [Validators.required]],
    });

    this.formVictima = this.formBuilder.group({
      primerNombre: [{ value: '', disabled: false }, [Validators.required]],
      segundoNombre: [{ value: '', disabled: false }],
      primerApellido: [{ value: '', disabled: false }, [Validators.required]],
      segundoApellido: [{ value: '', disabled: false }],
      fechaNacimiento: [{ value: '', disabled: false }, [Validators.required]],
      tipoDocumento: [{ value: '', disabled: true }, [Validators.required]],
      numeroDocumento: [{ value: '', disabled: true }, [Validators.required]],
      sexo: [{ value: '', disabled: false }, [Validators.required]],
      identidadGenero: [{ value: '', disabled: false }, [Validators.required]],
      ocupacion: ['', Validators.required],
      idEscolaridad: ['', Validators.required],
      relacionPareja: ['', Validators.required],
      relacionAgresor: ['', Validators.required],
      descripcionRelacionAgresor: [''],
      idDiscapacidad: [''],
      descripcionDiscapacidad: [''],
      embarazo: ['NO', Validators.required],
      mesesEmbarazo: [0, [Validators.max(9), Validators.min(0)]],
      victimaConflicto: [false, Validators.required],
      eps: [''],
      ips: [''],
      cultura: [''],
      numeroHijos: [0],
      hijos: [
        [
          {
            custodia: 0,
            edad: 0,
            sexo: 0,
          } as HijoInvolucrado,
        ],
      ],
      seguridad: [false],
      lugarExpedicion: [{ value: '', disabled: false }, [Validators.required]],
      fechaExpedicion: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.getInvolucradoVictima();
    this.getListaTipoDocumento();
    this.getListaSexo();
    this.getListaIdentidadGenero();
    this.getListaDiscapacidad();
    this.getListaNivelAcademico();
    this.getListaCultura();
    this.getListaTipoRelacion();
    this.getListaEstadoCivil();
    this.getListaOtros();
    this.getListaLugarExpedicion();  
  }

  /**
   * @description consulta la información del involucrado
   */
  public async getInvolucradoVictima() {
    this.identificacionDelRiesgoService
      .getInvolucradoVictima(this.tarea.idSolicitud)
      .subscribe((resultVictima) => {
        if (resultVictima && resultVictima.statusCode === CodigosRespuesta.OK) {
          this.victima = resultVictima.data;
          this.setFormDataVictima();
        } else {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        }
      });
  }
  /**
   * @description consulta la información del involucrado
   */
  public async getInvolucradoAgresor() {
    this.identificacionDelRiesgoService
      .getInvolucradoAgresor(this.tarea.idSolicitud)
      .subscribe((resultAgresor) => {
        if (resultAgresor && resultAgresor.statusCode === CodigosRespuesta.OK) {
          this.agresor = resultAgresor.data;
          this.setFormDataAgresor();
        } else {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        }
      });
  }

  private setFormInvolucrados(form: FormGroup, involucrado: InvolucradoDTO) {
    if (involucrado) {
      form.setValue(involucrado);
      if (this.victima.hijos) {
        this.setHijosVictima(this.victima.hijos);
      }
    }
  }

  /**
   * @description Setea los datos del formulario con los datos del agresor
   */
  private setFormDataAgresor() {
    const {
      id,
      nombres,
      apellidos,
      idGenero,
      telefonoContactoConfianza,
      firma,
      agresorConflicto,
      agresorconflictoDescripcion,
      direccionRecidencia,
      telefono,
      embarazo,
      relacionAgresor,
      descripcionRelacionAgresor,
      idDiscapacidad,
      descripcionDiscapacidad,
      mesesEmbarazo,
      victimaConflicto,
      eps,
      ips,
      relacionPareja,
      ...values
    } = this.nullToEmptyString(this.agresor);
    this.formAgresor.setValue({
      ...values,
      agresorOrganizacionCriminal: agresorConflicto ? true : false,
      descripcionOrganizacionCriminal: agresorconflictoDescripcion,
    });
    if (this.agresor.hijos) {
      this.setHijosAgresor(this.agresor.hijos);
    }
  }

  /**
   * @description Setea los datos del formulario con los datos del victima
   */
  private setFormDataVictima() {
    // Campos que no hacen parte del formulario pero si del dto
    const {
      id,
      nombres,
      apellidos,
      idGenero,
      telefonoContactoConfianza,
      firma,
      agresorConflicto,
      agresorconflictoDescripcion,
      edadAproximadaAgresor,
      direccionRecidencia,
      telefono,
      embarazo,
      ...values
    } = this.nullToEmptyString(this.victima);
    this.formVictima.setValue({
      ...values,
      seguridad: values.eps || values.ips ? true : false,
      embarazo: embarazo ? embarazo.toUpperCase() : 'NO',
    });
    const lugarExpedicionFormValue = this.victima.lugarExpedicion || ''  
    this.formVictima.controls['lugarExpedicion'].setValue(lugarExpedicionFormValue);

    if (this.victima.hijos) {
      this.setHijosVictima(this.victima.hijos);
    }
  }

  /**
   * Convierte los campos nulos en string vacio
   * @param object
   * @returns
   */
  nullToEmptyString(object: any) {
    for (const key in object) {
      if (
        Object.prototype.hasOwnProperty.call(object, key) &&
        object[key] == null
      ) {
        object[key] = '';
      }
    }
    return object;
  }

  /**
   * @description carga el select de Tipo Documento
   */
  private async getListaTipoDocumento() {
    const result = await this.sharedService.getDominioFromLocal(
      'Tipo_identificacion'
    );
    this.listaTipoDocumento = result;
  }

  /**
   * @description obtiene la lista de sexo
   */
  private async getListaSexo() {
    const result = await this.sharedService.getDominioFromLocal('Sexo');
    this.listaSexo = result;
  }

  /**
   * @description obtiene la lista de Identidad Genero
   */
  private async getListaIdentidadGenero() {
    const result = await this.sharedService.getDominioFromLocal('Genero');
    this.listaGenero = result;
  }

  /**
   * @description obtiene la lista de Nivel Academico
   */
  private async getListaNivelAcademico() {
    const result = await this.sharedService.getDominioFromLocal(
      'Nivel_Academico'
    );
    this.listaNivelAcademico = result;
  }

  /**
   * @description obtiene la lista de discapacidad
   */
  private async getListaDiscapacidad() {
    const result = await this.sharedService.getDominioFromLocal('Discapacidad');
    this.listaDiscapacidad = result;
  }

  /**
   * @description obtiene la lista de cultura
   */
  private async getListaCultura() {
    const result = await this.sharedService.getDominioFromLocal('Tipo_Cultura');
    this.listaCultura = result;
  }

  /**
   * @description obtiene la lista de relacion con el agresor
   */
  private async getListaTipoRelacion() {
    const result = await this.sharedService.getDominioFromLocal(
      'Tipo_Relacion'
    );
    this.listaTipoRelacion = result;
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
    if (
      this.showOnSubmitIsRequiredVictima ||
      this.showOnSubmitIsRequiredAgresor
    ) {
      return !form.get(name)?.valid || empty;
    }
    return dirty && required ? !form.get(name)?.valid || empty : false;
  }

  /**
   * @description actualiza el involucrado guardando sus datos en la base de datos
   */
  public postActualizarInvolucradoAgresor(): Observable<boolean> {
    let subject = new Subject<boolean>();
    const formValueAgresor: InvolucradoDTO = this.formAgresor.value;
    const bodyAgresor: ActualizacionInvolucrado = {
      idInvolucrado: this.agresor.id,
      ocupacion: formValueAgresor.ocupacion,
      Escolidad: formValueAgresor.idEscolaridad
        ? formValueAgresor.idEscolaridad
        : 0,
      RelacionPareja: 0,
      numeroHijos: formValueAgresor.numeroHijos
        ? formValueAgresor.numeroHijos
        : 0,
      Cultura: formValueAgresor.cultura ? formValueAgresor.cultura : 0,
      RelacionAgresor: 0,
      descripcionRelacionAgresor: '',
      TipoDiscapcidad: 0,
      informacionHijos: this.getHijos(this.formHijosAgresor),
      descripcionDiscapacidad: '',
      embarazo: 'NO',
      mesesEmbarazo: 0,
      victimaConflicto: false,
      eps: '',
      ips: '',
      agresorOrganizacionCriminal: formValueAgresor.agresorOrganizacionCriminal,
      descripcionOrganizacionCriminal:
        formValueAgresor.descripcionOrganizacionCriminal,
      idSexo: formValueAgresor.sexo,
      idRelacionPareja: formValueAgresor.relacionPareja,
      primerNombre: formValueAgresor.primerNombre,
      segundoNombre: formValueAgresor.segundoNombre,
      primerApellido: formValueAgresor.primerApellido,
      segundoApellido: formValueAgresor.segundoApellido,
      nombres: this.getNombreCompleto(formValueAgresor, true),
      apellidos: this.getNombreCompleto(formValueAgresor, false, true),
      idtipoDocumento: formValueAgresor.tipoDocumento
        ? formValueAgresor.tipoDocumento
        : 0,
      numeroDocumento: formValueAgresor.numeroDocumento
        ? formValueAgresor.numeroDocumento
        : '',
      lugarExpedicion: formValueAgresor.lugarExpedicion,
      fechaExpedicion: formValueAgresor.fechaExpedicion,
      idIdentidadGenero: formValueAgresor.identidadGenero,
      edadAproximadaAgresor: formValueAgresor.edadAproximadaAgresor
        ? formValueAgresor.edadAproximadaAgresor
        : 0,
    };
    if (bodyAgresor.informacionHijos?.length != bodyAgresor.numeroHijos) {
      this.modales.modalInformacion(
        'El numero de hijos no coincide con la información de los hijos registrados.'
      );
      subject.next(false);
      return subject.asObservable();
    }
    this.identificacionDelRiesgoService
      .postActualizarInvolucrado(bodyAgresor)
      .subscribe({
        next: ({ statusCode }) => {
          if (statusCode === CodigosRespuesta.OK) {
            this.modales
              .modalExito('Datos guardados exitosamente.')
              .subscribe(() => {
                subject.next(true);
              });
          }
        },
        error: () => {
          subject.next(false);
        },
      });

    return subject.asObservable();
  }

  /**
   * @description actualiza el involucrado guardando sus datos en la base de datos
   */
  public postActualizarInvolucradoVictima(): Observable<boolean> {
    let subject = new Subject<boolean>();
    const formValueVictima: InvolucradoDTO = this.formVictima.value;
    const bodyVictima: ActualizacionInvolucrado = {
      idInvolucrado: this.victima.id,
      ocupacion: formValueVictima.ocupacion,
      Escolidad: formValueVictima.idEscolaridad,
      RelacionPareja: formValueVictima.relacionPareja,
      numeroHijos: formValueVictima.numeroHijos
        ? formValueVictima.numeroHijos
        : 0,
      Cultura: formValueVictima.cultura ? formValueVictima.cultura : 0,
      RelacionAgresor: formValueVictima.relacionAgresor,
      descripcionRelacionAgresor: formValueVictima.descripcionRelacionAgresor,
      TipoDiscapcidad: formValueVictima.idDiscapacidad
        ? formValueVictima.idDiscapacidad
        : 0,
      informacionHijos: this.getHijos(this.formHijosVictima),
      descripcionDiscapacidad: formValueVictima.descripcionDiscapacidad,
      embarazo: formValueVictima.embarazo,
      mesesEmbarazo: formValueVictima.mesesEmbarazo,
      victimaConflicto: formValueVictima.victimaConflicto,
      eps: formValueVictima.eps,
      ips: formValueVictima.ips,
      descripcionOrganizacionCriminal: '',
      agresorOrganizacionCriminal: false,

      //nuevos campos solo para agresor:
      idSexo: formValueVictima.sexo,
      idRelacionPareja: formValueVictima.relacionPareja,
      nombres: this.getNombreCompleto(formValueVictima, true),
      apellidos: this.getNombreCompleto(formValueVictima, false, true),
      primerNombre: formValueVictima.primerNombre,
      segundoNombre: formValueVictima.segundoNombre,
      primerApellido: formValueVictima.primerApellido,
      segundoApellido: formValueVictima.segundoApellido,
      idtipoDocumento: this.victima.tipoDocumento,
      numeroDocumento: this.victima.numeroDocumento,
      idIdentidadGenero: formValueVictima.identidadGenero,
      lugarExpedicion: formValueVictima.lugarExpedicion,
      fechaExpedicion: formValueVictima.fechaExpedicion,
      fechaNacimiento: formValueVictima.fechaNacimiento,
    };
    if (bodyVictima.informacionHijos?.length != bodyVictima.numeroHijos) {
      this.modales.modalInformacion(
        'El numero de hijos no coincide con la información de los hijos registrados.'
      );
      subject.next(false);
      return subject.asObservable();
    }
    this.identificacionDelRiesgoService
      .postActualizarInvolucrado(bodyVictima)
      .subscribe({
        next: ({ statusCode }) => {
          if (statusCode === CodigosRespuesta.OK) {
            subject.next(true);
          }
        },
        error: () => {
          subject.next(false);
        },
      });

    return subject.asObservable();
  }
  /**
   * concatena el nombre completo del involucrado
   * @returns
   */
  public getNombreCompleto(
    involucrado: InvolucradoDTO,
    includeNombres: boolean = false,
    includeApellidos: boolean = false
  ) {
    const nombres = [
      includeNombres && involucrado.primerNombre
        ? involucrado.primerNombre
        : '',
      includeNombres && involucrado.segundoNombre
        ? involucrado.segundoNombre
        : '',
      includeApellidos && involucrado.primerApellido
        ? involucrado.primerApellido
        : '',
      includeApellidos && involucrado.segundoApellido
        ? involucrado.segundoApellido
        : '',
    ];
    return nombres.join(' ').trim();
  }
  changeHijosVictima() {
    let numHijos = this.formVictima.get('numeroHijos')?.value;

    if (!numHijos) {
      this.formHijosVictima = [];
    }

    if (numHijos && this.formHijosVictima.length != numHijos) {
      this.formHijosVictima = [];

      for (let index = 1; index <= numHijos; index++) {
        let hijo = this.formBuilder.group({
          custodia: ['', [Validators.required]],
          sexo: ['', [Validators.required]],
          edad: [
            0,
            [Validators.required, Validators.maxLength(2), Validators.max(99)],
          ],
        });

        this.formHijosVictima.push(hijo);
      }
    }
  }

  changeHijosAgresor() {
    let numHijos = this.formAgresor.get('numeroHijos')?.value;

    if (!numHijos) {
      this.formHijosAgresor = [];
    }

    if (numHijos && this.formHijosAgresor.length != numHijos) {
      this.formHijosAgresor = [];

      for (let index = 1; index <= numHijos; index++) {
        let hijo = this.formBuilder.group({
          custodia: ['', [Validators.required]],
          sexo: ['', [Validators.required]],
          edad: [0, [Validators.required]],
        });

        this.formHijosAgresor.push(hijo);
      }
    }
  }

  setHijosVictima(hijos: HijoInvolucrado[]) {
    let numHijos = hijos.length;

    if (numHijos == 0) {
      this.formHijosVictima = [];
    }

    if (numHijos && this.formHijosVictima.length != numHijos) {
      this.formHijosVictima = [];

      hijos.forEach((element) => {
        let hijo = this.formBuilder.group({
          custodia: [
            element.custodia ? element.custodia : '',
            [Validators.required],
          ],
          sexo: [element.sexo ? element.sexo : '', [Validators.required]],
          edad: [element.edad ? element.edad : 0, [Validators.required]],
        });

        this.formHijosVictima.push(hijo);
      });
    }
  }

  setHijosAgresor(hijos: HijoInvolucrado[]) {
    let numHijos = hijos.length;

    if (numHijos == 0) {
      this.formHijosAgresor = [];
    }

    if (numHijos && this.formHijosAgresor.length != numHijos) {
      this.formHijosAgresor = [];

      hijos.forEach((element) => {
        let hijo = this.formBuilder.group({
          custodia: [
            element.custodia ? element.custodia : '',
            [Validators.required],
          ],
          sexo: [element.sexo ? element.sexo : '', [Validators.required]],
          edad: [element.edad ? element.edad : 0, [Validators.required]],
        });

        this.formHijosAgresor.push(hijo);
      });
    }
  }

  /**
   * @description obtiene la lista de relacion con el agresor
   */
  private async getListaEstadoCivil() {
    const result = await this.sharedService.getDominioFromLocal('Estado_Civil');
    this.listaEstadoCivil = result;
  }

  /**
   * @description obtiene la lista de opcion Otro
   */
  private async getListaOtros() {
    const result = await this.sharedService.getDominioFromLocal('Tipo_Otro');
    this.listaOtros = result;
  }
  /**
   * @description obtiene la lista de opcion Otro
   */
  private async getListaLugarExpedicion() {
    this.sharedService.getLugarExpedicion().subscribe((lugarExpedicion) => {
      if (lugarExpedicion.statusCode === CodigosRespuesta.OK) {
        this.listaLugarExpedicion = lugarExpedicion.data;
      }
    });
  }

  /**
   * @description filtra solo números
   * @param input entrada
   */
  public inputNumber(
    input: HTMLInputElement,
    min: number = 0,
    max: number = 9
  ) {
    let value: number = Number(
      input.value
        .replace(Regex.NUMERO_G, '')
        .substring(0, max > 9 ? max.toString().length : 1)
    );

    if (value < min) {
      input.value = '';
    } else if (value > max) {
      input.value = 0 + '';
    } else {
      input.value = value + '';
    }
  }

  /**
   * @description filtra solo números
   * @param input entrada
   */
  public inputMeses(input: HTMLInputElement, form: FormGroup, field: string) {
    let value = input.value.replace(Regex.NUMERO_G, '');
    form.get(field)?.setValue(value);
  }
  /**
   * Resuelve los hijos del formulario
   * @param form
   * @returns
   */
  private getHijos(form: FormGroup[]): HijoInvolucrado[] {
    let lst: HijoInvolucrado[] = [];

    if (form.length > 0) {
      form.forEach((hijo) => {
        const formValueHijo: HijoInvolucrado = hijo.value;
        let h = {
          custodia: formValueHijo.custodia,
          edad:
            formValueHijo.edad && formValueHijo.edad > 99
              ? Number(`${formValueHijo.edad}`.substring(0, 2))
              : formValueHijo.edad,
          sexo: formValueHijo.sexo,
        };
        lst.push(h);
      });
      return lst;
    } else {
      return [];
    }
  }

  cancelar() {
    this.modales.modalCancelar('/psicologia');
  }

  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea, '/psicologia');
  }

  guardar(
    formulario: 'agresor' | 'victima',
    cerrarActuaciones: boolean = false
  ) {
    //Insertar aquí las acciones a realizar.
    if (formulario == 'victima') {
      if (this.isValidForm('victima')) {
        this.showOnSubmitIsRequiredVictima = false;
        this.postActualizarInvolucradoVictima().subscribe({
          next: (success) => {
            if (success && !cerrarActuaciones) {
              this.getInvolucradoAgresor();
              this.stepper.next();
            }
          },
          error: () => {
            this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
          },
        });
      } else {
        this.showOnSubmitIsRequiredVictima = true;
      }
    } else {
      this.postActualizarInvolucradoAgresor().subscribe({
        error: () => {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        },
      });
    }
  }

  cerrarActuaciones() {
    if (this.isValidForm('agresor') && this.isValidForm('victima')) {
      this.showOnSubmitIsRequiredVictima = false;

      this.postActualizarInvolucradoVictima().subscribe({
        next: (saved1) => {
          if (saved1) {
            this.postActualizarInvolucradoAgresor().subscribe({
              next: (saved2) => {
                if (saved2) {
                  this.cerrarTareaYCrearEvaluacionPsicologica();
                } else {
                  this.modales.modalInformacion(
                    'Error: No se capturó el idTarea'
                  );
                }
              },
            });
          }
        },
      });
    } else {
      this.showOnSubmitIsRequiredAgresor = true;
    }
  }

  /**
   * @description cierra la tarea y crea evaluacion psicologica
   */
  private cerrarTareaYCrearEvaluacionPsicologica() {
    this.modales
      .modalConfirmacion(Mensajes.MENSAJE_CERRAR_ACT)
      .subscribe((result) => {
        if (result) {
          this.identificacionDelRiesgoService
            .cerrarTareaYCrearEvaluacionPsicologica({
              idSolicitudServicio: this.tarea.idSolicitud,
              idTarea: this.tarea.idTarea,
            })
            .subscribe((cerrar) => {
              if (cerrar.statusCode === CodigosRespuesta.OK) {
                this.router.navigate(['/psicologia']);
              }
            });
        }
      });
  }

  /**
   * @description valida si el formulario es válido
   * @param formulario
   * @returns
   */
  isValidForm(formulario: 'agresor' | 'victima'): boolean {
    let camposRequeridos: string[];
    let errorHijos = 0;
    const form = formulario == 'agresor' ? this.formAgresor : this.formVictima;
    const formHijos =
      formulario == 'agresor' ? this.formHijosAgresor : this.formHijosVictima;
    camposRequeridos = SharedFunctions.findInvalidControls(form).concat(
      this.validarCamposObligatorios(form)
    );
    formHijos.forEach((element) => {
      if (!element.valid) {
        errorHijos++;
      }
    });
    if (errorHijos) {
      this.modales.modalInformacion(
        'La información de los hijos está incompleta'
      );
      return false;
    }
    return this.formVictima.valid && !camposRequeridos.length && !errorHijos;
  }

  private validarFormulario(
    formInvolucrado: FormGroup,
    esAgresor: boolean
  ): boolean {
    let errorHijos = 0;
    const camposRequeridos: string[] = SharedFunctions.findInvalidControls(
      formInvolucrado
    ).concat(this.validarCamposObligatorios(formInvolucrado));
    this.formHijosAgresor.forEach((element) => {
      if (!element.valid) {
        errorHijos++;
      }
    });
    if (errorHijos) {
      const mensajeModal: string = esAgresor
        ? 'La información de los hijos del agresor está incompleta'
        : 'La información de los hijos de la vícima está incompleta';
      this.modales.modalInformacion(mensajeModal);
      return false;
    }
    return formInvolucrado.valid && !camposRequeridos.length && !errorHijos;
  }

  private validarCamposObligatorios(form: FormGroup) {
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
  }
}
