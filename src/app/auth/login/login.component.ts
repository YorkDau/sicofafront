import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Mensajes, Regex } from 'src/app/constants';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formLogin!: FormGroup;
  public mostrarAlerta: boolean = false;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgCorreoInv: string = Mensajes.MENSAJE_CORREO_INV;
  private currentUser: UserInterface | undefined;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      usuario: ['', [Validators.required, Validators.pattern(Regex.EMAIL)]],
      password: ['', Validators.required],
    });
  }

  /**
   * @description
   */
  iniciarSesion() {

    if (this.formLogin.valid) {
      const { usuario, password } = this.formLogin.value;

      this.authService.login({ email: usuario, password }).subscribe({
        next: ({ data }) => {
          if (data && data.reset) {
            this.router.navigate(['/change-password']);
          } else if (data && !data.reset) {
            this.router.navigate(['/']);
          } else {
            this.mostrarAlerta = true;
          }
        },
        error: () => {
          this.mostrarAlerta = true;
        },
      });
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.formLogin.controls[campo]) {
      return this.formLogin.controls[campo].hasError('required');
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
    if (this.formLogin.controls[campo]) {
      return this.formLogin.controls[campo].hasError('pattern');
    } else {
      return false;
    }
  }
}
