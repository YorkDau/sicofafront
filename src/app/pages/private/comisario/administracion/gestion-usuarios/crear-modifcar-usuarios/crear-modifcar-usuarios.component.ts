import { Component, OnInit } from '@angular/core';
import { CodigosRespuesta, ImagenesModal, Mensajes, Regex } from 'src/app/constants';
import { crearUsuarioInterfce, modificarUsuarioInterfce, perfilesInterface, usuariosInterface } from '../../interfaces/gestion-usuarios.interface'
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { GestionUsuariosService } from '../../services/gestion-usuarios.service';
import { Modales } from 'src/app/shared/modals';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedFunctions } from 'src/app/shared/functions';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalInfoComponent } from 'src/app/shared/modal-info/modal-info.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-crear-modifcar-usuarios',
  templateUrl: './crear-modifcar-usuarios.component.html',
  styleUrls: ['./crear-modifcar-usuarios.component.scss']
})
export class CrearModifcarUsuariosComponent implements OnInit {

  public listaPerfiles: perfilesInterface[] = [];
  public listaTipoDocumento: DominioInterface[] = [];
  public myForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;
  public idUsuario: number = 0;
  public informacionUsuario!: usuariosInterface;
  public existeCiudadano: boolean = false;
  private user!: UserInterface | undefined;
  public idComisaria: number | undefined;

  constructor(
    private authService: AuthService,
    private gestionUsuario: GestionUsuariosService,
    private _dialog: MatDialog,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private _activedRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.cargarPerfiles();
    this.user = this.authService.currentUserValue;
    this.idComisaria = this.user?.idComisaria;
    this.store.select('tipo_documento').subscribe(({ tipo_documento }) => {
      this.listaTipoDocumento = tipo_documento;
    });
    this.getIdUsuario();

    if (this.idUsuario === undefined) {
      this.cargarForm();
    } else {
      this.cargarInformacionUsuario();
      this.cargarForm();
    }

  }

  public validacionEstado(): boolean {
    if (this.informacionUsuario === undefined) {
      return false
    } else {
      return true
    }
  }

  /**
   * @description Carga la lista de perfiles existentes
   */
  private cargarPerfiles() {
    this.gestionUsuario.getListaPerfiles().subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaPerfiles = data.data;
        } else {
          this.msgError()
        }
      },
      error: () => {
        this.msgError()
      }
    });
  }

  /**
   * @description  crea un nuevo usuario con los datos insertados
   * @param obj 
   */
  private crearNuevoUsuario(obj: crearUsuarioInterfce) {
    this.gestionUsuario.postCrearUsuario(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.msgExito('Usuario Creado Correctamente.');
          this.redireccionar();
        } else  {
          this.msgError();
        }
      },
      error: () => {
        //this.msgError();
        this.msgValidacionCorreoYDocumentacion();
      }
    });
  }

  /**
   * @description actualiza el usuario seleccionado 
   * @param obj 
   */
  private actualizarUsuario(obj: crearUsuarioInterfce) {
    this.gestionUsuario.actualizarUsuario(obj).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.msgExito('Se Actualizo Correctamente el Usuario');
          this.redireccionar();
        } else {
          this.msgError();
        }
      },
      error: () => {
        //this.msgError();
        this.msgValidacionCorreoYDocumentacion();
      }
    });
  }

  /**
   * @description toma el id de usuario del parametro de la ruta
   */
  private getIdUsuario() {
    this._activedRouter.params.subscribe((params: Params) => {
      this.idUsuario = params.idUsuarioSistema;
    });
  }
  /**
   * @description carga la informacion del usuario
   */
  private cargarInformacionUsuario() {
    this.gestionUsuario.UsuarioEspecifico(this.idUsuario).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.informacionUsuario = data.data
          // llena el form con la informacion del usuario
          let arrNombres = this.informacionUsuario.nombres.split(' ');
          let arrApellido = this.informacionUsuario.apellidos.split(' ');
          this.myForm.controls['tipoDocumento'].setValue(this.informacionUsuario.tipoDocumento);
          this.myForm.controls['numeroDocumento'].setValue(this.informacionUsuario.numeroDocumento);
          this.myForm.controls['primerNombre'].setValue(arrNombres[0]);
          this.myForm.controls['segundoNombre'].setValue(arrNombres[1]);
          this.myForm.controls['primerApellido'].setValue(arrApellido[0]);
          this.myForm.controls['segundoApellido'].setValue(arrApellido[1]);
          this.myForm.controls['celular'].setValue(this.informacionUsuario.celular);
          this.myForm.controls['telefonoFijo'].setValue(this.informacionUsuario.telefonoFijo);
          this.myForm.controls['correoElectronico'].setValue(this.informacionUsuario.correoElectronico);
          this.myForm.controls['perfil'].setValue(this.informacionUsuario.perfiles);
          this.myForm.controls['estado'].setValue(this.informacionUsuario.activo);

        }
      }
    });
  }
  /**
   * @description Carga el form para llenar los campos cuando se crea un usuario
   */
  private cargarForm() {
    this.myForm = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.pattern(Regex.ALFA)]],
      primerNombre: ['', [Validators.required, Validators.pattern(Regex.ALFA)]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required, Validators.pattern(Regex.ALFA)]],
      segundoApellido: [''],
      celular: ['', [Validators.pattern(Regex.ALFA)]],
      telefonoFijo: ['', [Validators.pattern(Regex.ALFA)]],
      correoElectronico: ['', [Validators.pattern(Regex.EMAIL), Validators.required]],
      perfil: [, Validators.required],
      estado: []
    });
  }

  /**
   * @description Solo permite ingresar numeros
   * @param campo 
   */
  public soloNumero(campo: string) {
    SharedFunctions.soloNumero(campo, this.myForm);
  }
  /**
   * @description Solo permite ingresar expresiones regulares 
   * @param campo 
   */
  public soloLetas(campo: string) {
    SharedFunctions.soloLetras(campo, this.myForm);
  }
  /**
   * @description Valida que los campos requeridos sean llenados
   * @param campo 
   * @returns boolean
   */
  public isRequired(form: FormGroup, campo: string): boolean {
    return form.controls[campo].hasError('required');
  }
  /**
   * @description Valida que le campo cumpla la exprecion regular
   * @param campo 
   * @returns boolean
   */
  public patternValid(campo: string): boolean {
    return this.myForm.controls[campo].hasError('pattern')
  }

  public guardar() {
    this.mostrarValidaciones = false;
    if (this.idUsuario === undefined) {
      if (this.myForm.invalid) {
        this.mostrarValidaciones = true;
      } else {
        this.crearNuevoUsuario(this.getDataPostCrearUsuario);
      }
    } else {
      if (this.myForm.invalid) {
        this.mostrarValidaciones = true;
      } else {
        this.actualizarUsuario(this.getDataPostModificar);
      }
    }

  }
  /**
   * @description redirecciona a la pantalla de lista de usuarios
   */
  public redireccionar() {
    this.router.navigate(['../comisario/gestion-usuarios']);
  }

  /**
   * @description get para llenare los datos necesarios para la creacion de un nuevo usuario
   */

  private get getDataPostCrearUsuario(): crearUsuarioInterfce {

    const perfiles = this.myForm.get('perfil')?.value;
    const tipoDeDocumento = parseInt(this.myForm.get('tipoDocumento')?.value);
    return {
      nombres: this.myForm.get('primerNombre')?.value + ' ' + this.myForm.get('segundoNombre')?.value,
      apellidos: this.myForm.get('primerApellido')?.value + ' ' + this.myForm.get('segundoApellido')?.value,
      celular: this.myForm.get('celular')?.value,
      correoElectronico: this.myForm.get('correoElectronico')?.value,
      numeroDocumento: this.myForm.get('numeroDocumento')?.value,
      telefonoFijo: this.myForm.get('telefonoFijo')?.value,
      tipoDocumento: tipoDeDocumento,
      perfiles: perfiles,
      idComisaria: this.idComisaria
    }
  }
  private get getDataPostModificar(): modificarUsuarioInterfce {

    const perfiles = this.myForm.get('perfil')?.value;


    const tipoDeDocumento = parseInt(this.myForm.get('tipoDocumento')?.value);
    return {
      idUsuarioSistema: this.idUsuario,
      nombres: this.myForm.get('primerNombre')?.value + ' ' + this.myForm.get('segundoNombre')?.value,
      apellidos: this.myForm.get('primerApellido')?.value + ' ' + this.myForm.get('segundoApellido')?.value,
      celular: this.myForm.get('celular')?.value,
      correoElectronico: this.myForm.get('correoElectronico')?.value,
      numeroDocumento: this.myForm.get('numeroDocumento')?.value,
      telefonoFijo: this.myForm.get('telefonoFijo')?.value,
      tipoDocumento: tipoDeDocumento,
      perfiles: perfiles,
      activo: this.myForm.get('estado')?.value,
      idComisaria: this.idComisaria
    }
  }

  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }

  private msgExito(texto: string) {
    Modales.modalExito(
      texto,
      ImagenesModal.OK,
      this._dialog
    );
  }

  private msgValidacionCorreoYDocumentacion() {
    Modales.modalExito(
      'Los datos ingresados ya existen. Por favor verifique.',
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}
