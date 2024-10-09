import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { lastValueFrom, switchMap } from 'rxjs';
import { CiudadanoService } from '../../ciudadano/services/ciudadano.service';
import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import * as validaciones from '../../ciudadano/registrar-ciudadano/validators';
import { ModalInfoComponent } from 'src/app/shared/modal-info/modal-info.component';
import { Modales } from '../../../../shared/modals';

import { SharedService } from '../../../../services/shared.service';
import * as interfaces from '../../interfaces/ciudadano.interface';
import { CiudadanoCompletoInterface } from '../../interfaces/ciudadano.interface';
import { ResponseInterface } from '../../../../interfaces/response.interface';
import { SharedFunctions } from 'src/app/shared/functions';
import { IUsuario } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../usuario/services/usuario.service';
import { PerfilService } from '../services/perfil.service';

@Component({
  selector: 'app-registrar-perfil',
  templateUrl: './registrar-perfil.component.html',
  styleUrls: ['./registrar-perfil.component.scss']
})
export class RegistrarPerfilComponent implements OnInit {


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
  public titulo: string = 'REGISTRO PERFIL';
  public tituloSubmit : string = 'Registro Perfil'
  cargos : any = [
   {
     id_Dominio: '1',
     nombre_Dominio: 'Administrador'
   },
   {
     id_Dominio: '2',
     nombre_Dominio: 'Abogado'
   },
   {
     id_Dominio: '3',
     nombre_Dominio: 'Psicologo'
   },
  ];

  identificaciones : any = [
    {
      id_Dominio: '1',
      nombre_Dominio: 'CC'
    },
    {
      id_Dominio: '2',
      nombre_Dominio: 'TI'
    },
    {
      id_Dominio: '3',
      nombre_Dominio: 'CE'
    },
  ];



  public actividades: any;

  private id_perfil: number | undefined = undefined;
  public perfil!: any;

  /**
   * @description valida si viene en modo editar
   */
  private get isUpdate(): boolean {
    return this.activated.snapshot.params['id_perfil'] !== undefined;
  }

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private modales: Modales,
    private router: Router,
    private sharedService: SharedService,
    private _usuarioService: UsuarioService,
    private activated: ActivatedRoute,
    private datePipe: DatePipe,
    private _perfilService: PerfilService
  ) {
    this.activated.params.subscribe((params) => {
      if (!params['id_perfil']) {
        return;
      } else {
        this.id_perfil = params['id_perfil'];
        this.getPerfil().then(() => {
          if (this.perfil) {
            this.tituloSubmit = 'Modificar Perfil';
            this.myForm.patchValue(this.perfil);
            this.setInitialValues(this.perfil.actividades);
          }
        });
      }
    });
  }
  setInitialValues(selectedActividades:any): void {
    const validValues = selectedActividades
      .map((actividad: { idActividad: any; }) => actividad.idActividad)
      .filter((idActividad: any) => 
        this.actividades.some((actividad: { idActividad: any; }) => actividad.idActividad === idActividad)
      );
    this.myForm.patchValue({ actividades: validValues });
  }



  ngOnInit(): void {

    this.cargarForm();
    this.resetValueChange();
    //this.cargarSelects();
    this.getPerfiles();
    //this.cargarFormEdit();
  }

  private getPerfiles() {
    this._perfilService.getActividades().subscribe((resp) => {
      if (resp.statusCode === CodigosRespuesta.OK) {
        this.actividades = resp.data;
      }
    });
  }

  /**
   * @description carga form
   */
  private cargarForm() {
    this.myForm = this.fb.group(
      {
        nombrePerfil: ['', [Validators.required]],
        codigo: ['', [Validators.required]],
        estado: [true],
        actividades: ['',[Validators.required]],
      },
    );
  }

  public async getPerfil() {
    let result;
    try {
      if (this.id_perfil) {
        result = await lastValueFrom(
          this._perfilService.getPerfil(this.id_perfil)
        );
        
      }
      if (!result) {
     
        return;
      }

      this.perfil = result.data;
     
    } catch (error: any) {
      SharedFunctions.getErrorMessage(error);
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G).subscribe(() => {
        history.back();
      });
    }
  }

  /**
   * @description carga formulario para editar
   */
  /*
  private cargarFormEdit() {
    if (this.isUpdate) {
      this.titulo = 'COMPLETAR REGISTRO USUARIO';
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
  */

  /**
   * @description establece los valores de maximo y minimo en los datepicker
   */


  /**
   * @description deja en estado inicial los campos abajo mencionado en el metodo
   */
  private resetValueChange() {
    this.myForm.get('tipDoc')?.valueChanges.subscribe((resp) => {
      this.yaExisteCiudadano();
    });
  }

  /**
   * @description carga los selects del formulario
   */
  /**
   * @description carga el select de Tipo Documento
   */

  public isChecked(campo: string): boolean {
    return this.myForm.get(campo)?.value;
  }

  public isRequired(campo: string): boolean {
    return this.myForm.controls[campo].hasError('required');
  }


  /**
   * @description alguno de los campos Celular, Correo, Telefono es requerido para completar el registro
   * hace validacion personal en validators.ts
   */
  public isRequiredDatosContacto(): boolean {
    return this.myForm.hasError('requiredDatosContacto');
  }



  /**
   * @description valida que el campo correo sea requerido con el formato ejemplo@aus.com
   */
  public isRequiredCorreo(): boolean {
    return this.myForm.hasError('requiredFormatoCorreo');
  }


  /**
   * @description abre modal de confirmacion
   */
  public modalConfirmacion() {
    Modales.modalConfirmacion(
      '¿Esta seguro que desea cancelar la creación del perfil?',
      this.dialog,
      'assets/images/exclamacion.svg'
    ).subscribe((resp) => {
      if (resp) {
        let tipoDocumento = this.myForm.get('tipDoc')?.value;
        let nroDocumento = this.myForm.get('nroDoc')?.value;
        this.myForm.reset();
        this.myForm.get('tipDoc')?.setValue(tipoDocumento);
        this.myForm.get('nroDoc')?.setValue(nroDocumento);
        this.router.navigate(['../perfil']);
      }
    });
  }

  camnbiarEstado(evn: any){

   if(evn.isTrusted){
    this.myForm.patchValue({
      estado: false
    })
   }

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

        this._usuarioService.validUsuario(parametros).subscribe((resp) => {
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
   * @description para registrar nuevo Perfil se valida que no exista en Base de Datos y si no existe, lo registra
   */
  public registrar(): void {
    this.mostrarValidaciones = false;
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      if (this.isUpdate) {
        console.log("Modificar")
        this.modificarPerfil()
      } else {
        this.registrarPerfil();
        console.log("NO modificar")

      }
    }
  }
  private modificarPerfil() {

    this._perfilService.actualizarPerfil(this.myForm.value,this.id_perfil).subscribe({
      next: (resp: ResponseInterface) => {
        if (resp.statusCode === CodigosRespuesta.OK) {
          this.myForm.reset()
          Modales.modalExito(
            Mensajes.MENSAJE_EXITO_ACTUALIZAR_PERFIL,
            'assets/images/check.svg',
            this.dialog
          );
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

  private registrarPerfil() {

    this._perfilService.registrarPerfil(this.myForm.value).subscribe({
      next: (resp: ResponseInterface) => {
        if (resp.statusCode === CodigosRespuesta.OK) {
          this.myForm.reset()
          Modales.modalExito(
            Mensajes.MENSAJE_EXITO_PERFIL,
            'assets/images/check.svg',
            this.dialog
          );
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
/*
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
*/

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
  }
}
