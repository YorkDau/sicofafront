import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Modales } from 'src/app/shared/modals';
import { AuthService } from '../services/auth.service';

import { ChangePasswordService } from '../services/change-password.service';
import { CustomValidators, validarIgualdad } from './validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public mostrarPassword = true;
  public mostrarConfirmacion = true;
  public mostrarValidasciones = false;
  public mostrarAlerta = false;
  public formPassword!: FormGroup;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;

  private user!: UserInterface | undefined;

  constructor(
    private fb: FormBuilder,
    private passwordService: ChangePasswordService,
    private router: Router,
    private modales: Modales,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue!;
    if(!this.user.reset) {
      this.router.navigate(['./']);
    } else {
      this.cargarForm();
    }
  }

  private postChangePassword(
    password: string
  ){
    this.passwordService.changePassword(password).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.modales.modalExito('Se cambio la contraseña exitosamente');
          sessionStorage.clear();
          this.authService.currentUserValue = undefined;
          this.router.navigate(['./login']);
        } else {
          this.mostrarAlerta = true;
        }
      }, 
      error: (err) => {
        this.mostrarAlerta = true;
      }
    });
  }

/**
 * @description carga el form para la contraseña y ademas carga las validaciones que este necesita 
 */
  private cargarForm(){
    this.formPassword = this.fb.group({
      nuevaPassword: ['', [Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        Validators.minLength(8)
      ]),]],
      confirmarPassword: ['', Validators.required]
    },
    {
      validators: [
        validarIgualdad(),
      ]
    });
  }
  /**
   * @description muestra la validacion si no se llena el campo
   * @param campo 
   * @returns boolean
   */
  public isRequired(campo: string): boolean {
    return this.formPassword.controls[campo].hasError('required');
  }
  /**
   * @description muestra la valicion si la confirmación de contraseña no es igual 
   * @returns boolean
   */
  public isRequiredEquals(): boolean {
    return this.formPassword.hasError('passwordNoEsIgual');
  }
  /**
   * @description muestra la validacion si la contraseña no tiene mínimo un numero 
   * @returns boolean
   */
  public hasNumber(): boolean{
    return this.formPassword.controls['nuevaPassword'].hasError('hasNumber');
  }
  /**
   * @description muestra la validacion si la contraseña no tiene mínimo una Mayuscula
   * @returns boolean
   */
  public hasCapitalCase(): boolean{
    return this.formPassword.controls['nuevaPassword'].hasError('hasCapitalCase');
  }
  /**
   * @description muestra la validacion si la contraseña no tiene mínimo una minuscula
   * @returns boolean
   */
  public hasSmallCase(): boolean{
    return this.formPassword.controls['nuevaPassword'].hasError('hasSmallCase');
  }

  public get getNueva(){
    return this.formPassword.get('nuevaPassword');
  }

  public guardar(){
    this.mostrarValidasciones = false;
    this.mostrarAlerta = false;
    if(this.formPassword.invalid){
      this.mostrarValidasciones = true;
    } else {
      let password = this.formPassword.get('nuevaPassword')?.value;
      this.postChangePassword(password);
    }
  }
}
