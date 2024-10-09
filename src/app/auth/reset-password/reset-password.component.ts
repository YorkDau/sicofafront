import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { ChangePasswordService } from '../services/change-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public form!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CORREO_INV;

  constructor(
    private fb: FormBuilder,
    private passwordService: ChangePasswordService,
    private modales: Modales,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      usuario: ['', [Validators.required, Validators.pattern(Regex.EMAIL)]]
    });
  }

  private getResetPassword(
    email: string
  ){
    this.passwordService.resetPassword(email).subscribe({
      next: (data: ResponseInterface) => {
        if (data) {
          this.modales.modalExito('Se envio un correo con su nueva contraseña');
          this.router.navigate(['./login']);
        } else {
          this.msgError(data);
        }
      }, 
      error: (data: string) => {
        this.msgError(data);
      }
    });
  }

  resetPassword() {
    this.mostrarValidaciones = false;
    if(this.form.valid){
      let email = this.form.get('usuario')?.value;
      this.getResetPassword(email);
    } else {
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
   public isRequired(campo: string): boolean {
    if (this.form.controls[campo]) {
      return this.form.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  public isRequiredPattern(campo: string): boolean{
    return this.form.controls[campo].hasError('pattern');
  }
  /**
   * @description mensaje de error para lo servicios
   */
   private msgError(mensaje: string) {
    this.modales.modalInformacion(mensaje);
  }

}
