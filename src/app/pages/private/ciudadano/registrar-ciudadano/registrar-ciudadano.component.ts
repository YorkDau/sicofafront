import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { switchMap } from 'rxjs';

import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import { CiudadanoService } from '../services/ciudadano.service';
import * as validaciones from './validators';
import { ModalInfoComponent } from 'src/app/shared/modal-info/modal-info.component';
import { Modales } from '../../../../shared/modals';

import { SharedService } from '../../../../services/shared.service';
import * as interfaces from '../../interfaces/ciudadano.interface';
import { CiudadanoCompletoInterface } from '../../interfaces/ciudadano.interface';
import { ResponseInterface } from '../../../../interfaces/response.interface';
import { SharedFunctions } from 'src/app/shared/functions';

@Component({
  selector: 'app-registrar-ciudadano',
  templateUrl: './registrar-ciudadano.component.html',
  styleUrls: ['./registrar-ciudadano.component.scss'],
  providers: [DatePipe],
})
export class RegistrarCiudadanoComponent implements OnInit {
  public myForm!: FormGroup;
  public minDate!: Date;
  public maxDate!: Date;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgObligatorioContacto: string = Mensajes.MENSAJE_DATOS_CONTACTO;
  public msgObligatorioCorreo: string = Mensajes.MENSAJE_CORREO;
  public msgObligatorioAfiliacion: string = Mensajes.MENSAJE_DATOS_AFILIACION;
  public existe: boolean = false;
  public selectTipoDocumento: interfaces.DominioInterface[] = [];
  public selectLugarExpedicion: interfaces.LugarExpedicionInterface[] = [];
  public selectPaises: interfaces.PaisInterface[] = [];
  public selectDepartamento: interfaces.DepartamentoInterface[] = [];
  public selectMunicipio: interfaces.MunicipioInterface[] = [];
  public selectLocalidad: interfaces.DominioInterface[] = [];
  public selectSexo: interfaces.DominioInterface[] = [];
  public selectGenero: interfaces.DominioInterface[] = [];
  public selectOrientacion: interfaces.DominioInterface[] = [];
  public selectNivel_Academico: interfaces.DominioInterface[] = [];
  public selectDiscapacidad: interfaces.DominioInterface[] = [];
  public cColombiano: boolean = false;
  public cDiscapacidad: boolean = false;
  public cEmbarazo: boolean = false;
  public cAfiliado: boolean = false;
  public ciudadano!: interfaces.CiudadanoInterface;
  public idCiudadano!: number;
  public titulo: string = 'REGISTRO DE NUEVO CIUDADANO';

  /**
   * @description valida si viene en modo editar
   */
  private get isUpdate(): boolean {
    return this.activedRoute.snapshot.params['id_ciudadano'] !== undefined;
  }

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService,
    private ciudadanoService: CiudadanoService,
    private activedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.valoresMaxMinDatePicker();
    this.cargarForm();
    this.habilitarCampos();
    this.resetValueChange();
    this.cargarSelects();
    this.cargarFormEdit();
  }

  /**
   * @description carga form
   */
  private cargarForm() {
    this.myForm = this.fb.group(
      {
        pnombre: ['', [Validators.required, Validators.pattern(Regex.ALFA)]],
        snombre: ['', [Validators.pattern(Regex.ALFA)]],
        papellidos: ['', [Validators.required, Validators.pattern(Regex.ALFA)]],
        sapellidos: ['', [Validators.pattern(Regex.ALFA)]],
        tipDoc: ['', [Validators.required]],
        nroDoc: ['', [Validators.required, Validators.pattern(Regex.ALFA)]],
        fechaExp: '',
        lugarExp: '',
        fechaNac: '',
        edad: ['', [Validators.required]],
        pais: '',
        departamento: '',
        municipio: '',
        localidad: '',
        barrio: ['', [Validators.pattern(Regex.ALFA)]],
        sexo: '',
        idGenero: '',
        orientacionSexual: '',
        nivAcademico: ['', [Validators.required]],
        telefono: ['', [Validators.pattern(Regex.ALFA)]],
        celular: ['', [Validators.pattern(Regex.ALFA)]],
        correoElectronico: '',
        dirResidencia: '',
        rDiscapacidad: ['no', [Validators.required]],
        discapacidad: '',
        rEmbarazo: ['no', [Validators.required]],
        embarazo: '',
        rAfiliado: ['no', [Validators.required]],
        eps: '',
        ips: '',
        chkLGBTI: false,
        chkNinoAdolecente: false,
        chkMigrante: false,
        chkVictimaComArm: false,
        chkPerLideresa: false,
        chkPerHabitalidad: false,
        chkIndigena: false,
        indigena: '',
        aceptaTratamiento: [false, [Validators.requiredTrue]],
      },
      {
        validators: [
          validaciones.validarDatosContacto,
          validaciones.validarCorreo,
          validaciones.validarDiscapacidad,
          validaciones.validarEmbarazo,
          validaciones.validarIndigena,
        ],
      }
    );
  }

  /**
   * @description carga formulario para editar
   */
  private cargarFormEdit() {
    if (this.isUpdate) {
      this.titulo = 'COMPLETAR REGISTRO CIUDADANO';
      this.activedRoute.params
        .pipe(
          switchMap((_) =>
            this.ciudadanoService.cargarEditCiudadano(
              this.activedRoute.snapshot.params['id_ciudadano']
            )
          )
        )
        .subscribe((ciudadano) => {
          this.cargaSelectPaises(ciudadano.data.idTipoDocumento);
          if (ciudadano.data.idPaisNacimiento == 1) {
            this.cColombiano = true;
            this.sharedService
              .getDepartamentos(ciudadano.data.idPaisNacimiento)
              .subscribe((departamentos) => {
                if (departamentos.statusCode === CodigosRespuesta.OK) {
                  this.selectDepartamento = departamentos.data;
                }
              });
            this.sharedService
              .getCiudades(ciudadano.data.idDepartamentoNacimiento)
              .subscribe((municipios) => {
                if (municipios.statusCode === CodigosRespuesta.OK) {
                  this.selectMunicipio = municipios.data;
                }
              });

            this.sharedService
              .getLocalidadPorMunicipio(ciudadano.data.idMunicipioNacimiento)
              .subscribe((localidades) => {
                if (localidades.statusCode === CodigosRespuesta.OK) {
                  this.selectLocalidad = localidades.data;
                }
              });
          }
          this.setDataPost(ciudadano.data);
        });

      this.myForm.get('tipDoc')?.disable();
      this.myForm.get('nroDoc')?.disable();
    }
  }

  /**
   * @description establece los valores de maximo y minimo en los datepicker
   */
  private valoresMaxMinDatePicker() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(
      currentYear,
      new Date().getMonth(),
      new Date().getDate()
    );
  }

  /**
   * @description deja en estado inicial los campos abajo mencionado en el metodo
   */
  private resetValueChange() {
    this.myForm.get('tipDoc')?.valueChanges.subscribe((resp) => {
      this.yaExisteCiudadano();
    });
    this.myForm.get('rDiscapacidad')?.valueChanges.subscribe((resp) => {
      this.myForm.get('discapacidad')?.setValue('');
    });
    this.myForm.get('rEmbarazo')?.valueChanges.subscribe((resp) => {
      this.myForm.get('embarazo')?.setValue('');
    });
    this.myForm.get('rAfiliado')?.valueChanges.subscribe((resp) => {
      this.myForm.get('ips')?.setValue('');
      this.myForm.get('eps')?.setValue('');
    });
    this.myForm.get('chkIndigena')?.valueChanges.subscribe((resp) => {
      this.myForm.get('indigena')?.setValue('');
    });
  }

  /**
   * @description carga los selects del formulario
   */
  private cargarSelects() {
    this.cargaSelectTipoDocumento();
    this.cargaSelectLugarExpedicion();
    this.cargaSelectSexo();

    this.cargaSelectIdentidadGenero();
    this.cargaSelectOrientacionSexual();
    this.cargaSelectNivel_Academico();
    this.cargaSelectDiscapacidad();
  }

  /**
   * @description carga el select de Tipo Documento
   */
  private cargaSelectTipoDocumento() {
    this.sharedService
      .getDominio('Tipo_identificacion')
      .subscribe((TipoDocumento) => {
        if (TipoDocumento.statusCode === CodigosRespuesta.OK) {
          this.selectTipoDocumento = TipoDocumento.data;
        }
      });
  }

  /**
   * @description carga el select de sexo
   */
  private cargaSelectLugarExpedicion() {
    this.sharedService.getLugarExpedicion().subscribe((lugarExpedicion) => {
      if (lugarExpedicion.statusCode === CodigosRespuesta.OK) {
        this.selectLugarExpedicion = lugarExpedicion.data;
      }
    });
  }

  /**
   * @description carga el select de sexo
   */
  private cargaSelectSexo() {
    this.sharedService.getDominio('Sexo').subscribe((sexo) => {
      if (sexo.statusCode === CodigosRespuesta.OK) {
        this.selectSexo = sexo.data;
      }
    });
  }

  /**
   * @description carga el select de Identidad Genero
   */
  private cargaSelectIdentidadGenero() {
    this.sharedService.getDominio('Genero').subscribe((genero) => {
      if (genero.statusCode === CodigosRespuesta.OK) {
        this.selectGenero = genero.data;
      }
    });
  }

  /**
   * @description carga el select de Orientacion Sexual
   */
  private cargaSelectOrientacionSexual() {
    this.sharedService.getDominio('Orientacion').subscribe((orientacion) => {
      if (orientacion.statusCode === CodigosRespuesta.OK) {
        this.selectOrientacion = orientacion.data;
      }
    });
  }

  /**
   * @description carga el select de Nivel Academico
   */
  private cargaSelectNivel_Academico() {
    this.sharedService
      .getDominio('Nivel_Academico')
      .subscribe((nivel_Academico) => {
        if (nivel_Academico.statusCode === CodigosRespuesta.OK) {
          this.selectNivel_Academico = nivel_Academico.data;
        }
      });
  }

  /**
   * @description carga el select de discapacidad
   */
  private cargaSelectDiscapacidad() {
    this.sharedService.getDominio('Discapacidad').subscribe((discapacidad) => {
      if (discapacidad.statusCode === CodigosRespuesta.OK) {
        this.selectDiscapacidad = discapacidad.data;
      }
    });
  }

  /**
   * @description carga el select pais dependiendo si es colombiano y habilita el departamento y municipio
   */
  public isColombiano(event: any) {
    this.cColombiano = false;
    this.myForm.get('pais')?.setValue('');
    if (event.target.value != 0) {
      this.cargaSelectPaises(event.target.value);
    }
  }

  /**
   * @description carga el select de paises
   */
  private cargaSelectPaises(idTipDoc: number) {
    this.sharedService.getPaisPorId(idTipDoc).subscribe((paises) => {
      if (paises.statusCode === CodigosRespuesta.OK) {
        this.selectPaises = paises.data;
      }
    });
  }

  /**
   * @description carga el select departamento dependiendo del pais
   */
  public cargaSelectDepartamento(event: any) {
    this.myForm.get('departamento')?.setValue('');
    this.myForm.get('municipio')?.setValue('');
    this.myForm.get('localidad')?.setValue('');

    if (event.target.value == 1) {
      this.cColombiano = true;
    }
    if (event.target.value != 0) {
      this.sharedService
        .getDepartamentos(event.target.value)
        .subscribe((departamentos) => {
          if (departamentos.statusCode === CodigosRespuesta.OK) {
            this.selectDepartamento = departamentos.data;
          }
        });
    }
  }

  /**
   * @description carga el select municipio dependiendo del departamento y del pais
   */
  public cargaSelectMunicipio(event: any) {
    this.myForm.get('municipio')?.setValue('');
    this.myForm.get('localidad')?.setValue('');

    if (event.target.value != 0) {
      this.sharedService
        .getCiudades(event.target.value)
        .subscribe((municipio) => {
          if (municipio.statusCode === CodigosRespuesta.OK) {
            this.selectMunicipio = municipio.data;
          }
        });
    }
  }

  /**
   * @description carga el select localidad dependiendo del municipio
   */
  public cargaSelectLocalidad(event: any) {
    this.myForm.get('localidad')?.setValue('');
    const municipioSeleccionado = event.target.selectedOptions[0]
      .text as string;

    if (
      municipioSeleccionado.toLowerCase() === 'bogotá' ||
      municipioSeleccionado.toLowerCase() === 'bogota'
    ) {
      this.sharedService
        .getLocalidadPorMunicipio(event.target.value)
        .subscribe((localidades) => {
          if (localidades.statusCode === CodigosRespuesta.OK) {
            this.selectLocalidad = localidades.data;
          }
        });
    }
  }

  /**
   * @description habilita los campos (Discapacidad, Embarazo, Afiliado salud) dependiendo de lo seleccionado
   */
  public habilitarCampos() {
    this.myForm.get('rDiscapacidad')?.valueChanges.subscribe((resp) => {
      if (resp === 'si') {
        this.cDiscapacidad = true;
      } else {
        this.cDiscapacidad = false;
      }
    });

    this.myForm.get('rEmbarazo')?.valueChanges.subscribe((resp) => {
      if (resp === 'si') {
        this.cEmbarazo = true;
      } else {
        this.cEmbarazo = false;
      }
    });

    this.myForm.get('rAfiliado')?.valueChanges.subscribe((resp) => {
      if (resp === 'si') {
        this.cAfiliado = true;
      } else {
        this.cAfiliado = false;
      }
    });
  }

  /**
   * @description valida que los campos de check sean obligatorios o requeridos
   * @param campo variable para ingresar el campo marcado
   */
  public isChecked(campo: string): boolean {
    return this.myForm.get(campo)?.value;
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    return this.myForm.controls[campo].hasError('required');
  }

  /**
   * @description campo discapacidad requerido cuando el radio de discapacidad esta marcado en si
   * hace validacion personal en validators.ts
   */
  public isRequiredDiscapacidad(): boolean {
    return this.myForm.hasError('requiredDiscapacidad');
  }

  /**
   * @description alguno de los campos Celular, Correo, Telefono es requerido para completar el registro
   * hace validacion personal en validators.ts
   */
  public isRequiredDatosContacto(): boolean {
    return this.myForm.hasError('requiredDatosContacto');
  }

  /**
   * @description campo indigena requerido cuando el check de indigena esta marcado en true
   * hace validacion personal en validators.ts
   */
  public isRequiredIndigena(): boolean {
    return this.myForm.hasError('requiredIndigena');
  }

  /**
   * @description campo embarzo requerido cuando el radio de se encuentra embarazo esta marcado en si
   * hace validacion personal en validators.ts
   */
  public isRequiredEmbarazo(): boolean {
    return this.myForm.hasError('requiredEmbarazo');
  }

  /**
   * @description campo Eps o Ips requerido cuando el radio de se encuentra afiliado esta marcado en si
   * hace validacion personal en validators.ts
   */
  public isRequiredAfiliado(): boolean {
    return this.myForm.hasError('requiredAfiliado');
  }

  /**
   * @description campo Localidad se habilita cuando marquen "Bogota" en municipio
   */
  public isBogota(): boolean {
    return this.myForm.controls['municipio'].value == 46 ? true : false;
  }

  /**
   * @description valida que el campo localidad sea requerido cuando marquen "Bogota" en municipio
   */
  public isRequiredBogota(): boolean {
    return this.myForm.hasError('requiredlocalidad');
  }

  /**
   * @description valida que el campo departamento sea requerido cuando marquen "Colombia" en pais
   */
  public isRequiredDepartamento(): boolean {
    return this.myForm.hasError('requiredDepartamento');
  }

  /**
   * @description valida que el campo Municipio sea requerido cuando marquen "Colombia" en pais
   */
  public isRequiredMunicipio(): boolean {
    return this.myForm.hasError('requiredMunicipio');
  }

  /**
   * @description valida que el campo correo sea requerido con el formato ejemplo@aus.com
   */
  public isRequiredCorreo(): boolean {
    return this.myForm.hasError('requiredFormatoCorreo');
  }

  /**
   * @description filtra solo números
   * @param input entrada
   */
  public formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(Regex.NUMERO_G, '');
  }

  /**
   * @description abre modal de confirmacion
   */
  public modalConfirmacion() {
    Modales.modalConfirmacion(
      '¿Esta seguro que desea cancelar la creación del ciudadano?',
      this.dialog,
      'assets/images/exclamacion.svg'
    ).subscribe((resp) => {
      if (resp) {
        let tipoDocumento = this.myForm.get('tipDoc')?.value;
        let nroDocumento = this.myForm.get('nroDoc')?.value;
        this.myForm.reset();
        this.myForm.get('tipDoc')?.setValue(tipoDocumento);
        this.myForm.get('nroDoc')?.setValue(nroDocumento);
        this.router.navigate(['../ciudadano']);
      }
    });
  }

  /**
   * @description funcion para calcular la edad del ciudadano
   * @param event resive el evento para calcular la edad
   */
  public calcularEdad(event: MatDatepickerInputEvent<Date>): number {
    if (event.value) {
      const edad = Math.floor(
        Math.abs(Date.now() - <any>new Date(event.value)) /
          (1000 * 3600 * 24) /
          365
      );
      this.myForm.controls['edad'].setValue(edad);
      return edad;
    }
    return 0;
  }

  /**
   * @description valida contra base de datos si ya existe el ciudadano
   */
  public yaExisteCiudadano(): void {
    this.existe = false;
    if (!this.isUpdate) {
      if (
        this.myForm.controls['tipDoc'].value != 0 &&
        this.myForm.controls['nroDoc'].value !== ''
      ) {
        const parametros = {
          numeroDocumento: this.myForm.controls['nroDoc'].value,
          idtipoDocumento: this.myForm.controls['tipDoc'].value,
        };
        this.ciudadanoService.validCiudadano(parametros).subscribe((resp) => {
          if (resp.statusCode === CodigosRespuesta.OK) {
            if (resp.data) {
              this.modalInformacion();
            }
          }
        });
      }
    }
  }

  /**
   * @description abre modal de info ya existe ciudadano
   */
  private modalInformacion() {
    const dialogResp = this.dialog.open(ModalInfoComponent, {
      panelClass: 'modal-info',
      data: {
        mensaje: `El ciudadano que intenta crear ya existe`,
        image: 'assets/images/exclamacion.svg',
      },
    });

    dialogResp.afterClosed().subscribe((resp) => {
      if (!resp) {
        this.myForm.controls['tipDoc'].reset('');
        this.myForm.controls['nroDoc'].reset('');
      }
    });
  }

  /**
   * @description envía a form historial del ciudadano
   * @param ciudadano info del ciudadano
   */
  historialCiudadano(ciudadano: interfaces.CiudadanoInterface) {
    sessionStorage.setItem('ciudadano', JSON.stringify(ciudadano));
    this.router.navigate(['/historial-ciudadano', ciudadano.idCiudadano]);
  }

  /**
   * @description para registrar nuevo ciudadano se valida que no exista en Base de Datos y si no existe, lo registra
   */
  public registrar(): void {
    this.mostrarValidaciones = false;

    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      if (this.isUpdate) {
        this.actualizarCiudadano();
      } else {
        this.insertarCiudadano();
      }
    }
  }

  /**
   * @description Solo permite ingresar numeros
   */
  public soloNumero(campo: string) {
    SharedFunctions.soloNumero(campo, this.myForm);
  }

  /**
   * @description inserta el ciudadano
   */
  private insertarCiudadano() {
    this.ciudadanoService.registrarCiudadano(this.getDataPost).subscribe({
      next: (resp: ResponseInterface) => {
        if (resp.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_EXITO_CIUDADANO,
            'assets/images/check.svg',
            this.dialog
          );
          this.historialCiudadano(resp.data.datosPaginados);
        }
      },
      error: () => {
        Modales.modalExito(
          Mensajes.MENSAJE_ERROR,
          'assets/images/exclamacion.svg',
          this.dialog
        );
      },
    });
  }

  /**
   * @description actualiza el ciudadano
   */
  private actualizarCiudadano() {
    this.idCiudadano = this.activedRoute.snapshot.params['id_ciudadano'];
    this.ciudadanoService.editCiudadano(this.getDataPost).subscribe({
      next: (resp: ResponseInterface) => {
        if (resp.statusCode === CodigosRespuesta.OK) {
          Modales.modalExito(
            Mensajes.MENSAJE_EXITO_CIUDADANO,
            'assets/images/check.svg',
            this.dialog
          );
          this.historialCiudadano(resp.data.datosPaginados);
        }
      },
      error: () => {
        Modales.modalExito(
          Mensajes.MENSAJE_ERROR,
          'assets/images/exclamacion.svg',
          this.dialog
        );
      },
    });
  }

  /**
   * @description interface para obtener los datos del formulario
   */
  private get getDataPost(): CiudadanoCompletoInterface {
    return {
      idCiudadano: this.isUpdate ? this.idCiudadano : 0,
      primerNombre: this.myForm.get('pnombre')?.value,
      segundoNombre: this.myForm.get('snombre')?.value,
      primerApellido: this.myForm.get('papellidos')?.value,
      segundoApellido: this.myForm.get('sapellidos')?.value,
      idTipoDocumento: this.myForm.get('tipDoc')?.value,
      numeroDocumento: this.myForm.get('nroDoc')?.value,
      fechaExpedicion: this.datePipe.transform(
        this.myForm.get('fechaExp')?.value,
        'dd/MM/yyyy HH:mm:ss'
      )!,
      idlugarExpedicion:
        this.myForm.get('lugarExp')?.value == ''
          ? 0
          : this.myForm.get('lugarExp')?.value,
      fechaNacimiento: this.datePipe.transform(
        this.myForm.get('fechaNac')?.value,
        'dd/MM/yyyy HH:mm:ss'
      )!,
      edad: this.myForm.get('edad')?.value,
      idPaisNacimiento:
        this.myForm.get('pais')?.value == ''
          ? 0
          : this.myForm.get('pais')?.value,
      idDepartamentoNacimiento:
        this.myForm.get('departamento')?.value == ''
          ? 0
          : this.myForm.get('departamento')?.value,
      idMunicipioNacimiento:
        this.myForm.get('municipio')?.value == ''
          ? 0
          : this.myForm.get('municipio')?.value,
      idSexo:
        this.myForm.get('sexo')?.value == ''
          ? 0
          : this.myForm.get('sexo')?.value,
      idIdentidadGenero:
        this.myForm.get('idGenero')?.value == ''
          ? 0
          : this.myForm.get('idGenero')?.value,
      idOrientacionSexual:
        this.myForm.get('orientacionSexual')?.value == ''
          ? 0
          : this.myForm.get('orientacionSexual')?.value,
      idNivelAcademico:
        this.myForm.get('nivAcademico')?.value == ''
          ? 0
          : this.myForm.get('nivAcademico')?.value,
      direccionResidencia: this.myForm.get('dirResidencia')?.value,
      idLocalidad:
        this.myForm.get('localidad')?.value == ''
          ? 0
          : this.myForm.get('localidad')?.value,
      barrio: this.myForm.get('barrio')?.value,
      telefono: this.myForm.get('telefono')?.value,
      celular: this.myForm.get('celular')?.value,
      correoElectronico: this.myForm.get('correoElectronico')?.value,
      idDiscapasidad:
        this.myForm.get('discapacidad')?.value == ''
          ? 0
          : this.myForm.get('discapacidad')?.value,
      estadoEmbarazo: {
        estadoEmbarazo: this.myForm.get('rEmbarazo')?.value,
        mesesEmbarazo:
          this.myForm.get('embarazo')?.value == ''
            ? 0
            : this.myForm.get('embarazo')?.value,
      },
      afiliadoSeguridadSocial: {
        estaAfiliado: this.myForm.get('rAfiliado')?.value,
        eps: this.myForm.get('eps')?.value,
        ips: this.myForm.get('ips')?.value,
      },
      poblacionLgtbi: this.myForm.get('chkLGBTI')?.value,
      ninoNinaAdolocente: this.myForm.get('chkNinoAdolecente')?.value,
      migrante: this.myForm.get('chkMigrante')?.value,
      victimaConflictoArmado: this.myForm.get('chkVictimaComArm')?.value,
      personasLideresDefensorasDH: this.myForm.get('chkPerLideresa')?.value,
      personasHabitalidadCalle: this.myForm.get('chkPerHabitalidad')?.value,
      puebloIndigena: this.myForm.get('indigena')?.value,
    };
  }

  /**
   * @description setea los valores del formulario
   */
  private setDataPost(resp: any) {
    this.myForm.get('pnombre')?.setValue(resp.primerNombre);
    this.myForm.get('snombre')?.setValue(resp.segundoNombre);
    this.myForm.get('papellidos')?.setValue(resp.primerApellido);
    this.myForm.get('sapellidos')?.setValue(resp.segundoApellido);
    this.myForm.get('tipDoc')?.setValue(resp.idTipoDocumento);
    this.myForm.get('nroDoc')?.setValue(resp.numeroDocumento);
    resp.fechaExpedicion == '01/01/0001'
      ? this.myForm.get('fechaExp')?.setValue('')
      : this.myForm.get('fechaExp')?.setValue(new Date(resp.fechaExpedicion));
    resp.idlugarExpedicion == 0
      ? this.myForm.get('lugarExp')?.setValue('')
      : this.myForm.get('lugarExp')?.setValue(resp.idlugarExpedicion);
    resp.fechaNacimiento == '01/01/0001'
      ? this.myForm.get('fechaNac')?.setValue('')
      : this.myForm.get('fechaNac')?.setValue(new Date(resp.fechaNacimiento));
    resp.edad != 0
      ? this.myForm.get('edad')?.setValue(resp.edad)
      : this.myForm.get('edad')?.setValue('');
    resp.idPaisNacimiento == 0
      ? this.myForm.get('pais')?.setValue('')
      : this.myForm.get('pais')?.setValue(resp.idPaisNacimiento);
    resp.idDepartamentoNacimiento == 0
      ? this.myForm.get('departamento')?.setValue('')
      : this.myForm
          .get('departamento')
          ?.setValue(resp.idDepartamentoNacimiento);
    resp.idMunicipioNacimiento == 0
      ? this.myForm.get('municipio')?.setValue('')
      : this.myForm.get('municipio')?.setValue(resp.idMunicipioNacimiento);
    resp.idLocalidad == 0
      ? this.myForm.get('localidad')?.setValue('')
      : this.myForm.get('localidad')?.setValue(resp.idLocalidad);
    resp.idSexo == 0
      ? this.myForm.get('sexo')?.setValue('')
      : this.myForm.get('sexo')?.setValue(resp.idSexo);
    resp.idIdentidadGenero == 0
      ? this.myForm.get('idGenero')?.setValue('')
      : this.myForm.get('idGenero')?.setValue(resp.idIdentidadGenero);
    resp.idOrientacionSexual == 0
      ? this.myForm.get('orientacionSexual')?.setValue('')
      : this.myForm
          .get('orientacionSexual')
          ?.setValue(resp.idOrientacionSexual);
    resp.idNivelAcademico == 0
      ? this.myForm.get('nivAcademico')?.setValue('')
      : this.myForm.get('nivAcademico')?.setValue(resp.idNivelAcademico);
    this.myForm.get('dirResidencia')?.setValue(resp.direccionResidencia);
    this.myForm.get('barrio')?.setValue(resp.barrio);
    this.myForm.get('telefono')?.setValue(resp.telefono);
    this.myForm.get('celular')?.setValue(resp.celular);
    this.myForm.get('correoElectronico')?.setValue(resp.correoElectronico);
    if (resp.idDiscapasidad != 0) {
      this.myForm.get('rDiscapacidad')?.setValue('si');
      this.myForm.get('discapacidad')?.setValue(resp.idDiscapasidad);
    }
    resp.estadoEmbarazo.estadoEmbarazo == null
      ? this.myForm.get('rEmbarazo')?.setValue('no')
      : this.myForm
          .get('rEmbarazo')
          ?.setValue(resp.estadoEmbarazo.estadoEmbarazo);
    this.myForm.get('embarazo')?.setValue(resp.estadoEmbarazo.mesesEmbarazo);
    resp.afiliadoSeguridadSocial.estaAfiliado == null
      ? this.myForm.get('rAfiliado')?.setValue('no')
      : this.myForm
          .get('rAfiliado')
          ?.setValue(resp.afiliadoSeguridadSocial.estaAfiliado);
    this.myForm.get('eps')?.setValue(resp.afiliadoSeguridadSocial.eps);
    this.myForm.get('ips')?.setValue(resp.afiliadoSeguridadSocial.ips);
    this.myForm.get('chkLGBTI')?.setValue(resp.poblacionLgtbi);
    this.myForm.get('chkNinoAdolecente')?.setValue(resp.ninoNinaAdolocente);
    this.myForm.get('chkMigrante')?.setValue(resp.migrante);
    this.myForm.get('chkVictimaComArm')?.setValue(resp.victimaConflictoArmado);
    this.myForm
      .get('chkPerLideresa')
      ?.setValue(resp.personasLideresDefensorasDH);
    this.myForm
      .get('chkPerHabitalidad')
      ?.setValue(resp.personasHabitalidadCalle);
    if (resp.puebloIndigena != '') {
      this.myForm.get('chkIndigena')?.setValue(true);
      this.myForm.get('indigena')?.setValue(resp.puebloIndigena);
    }
  }
}
