import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import {
  AuthService,
  ComisariaAuth,
  PerfilAuth,
} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-set-perfil',
  templateUrl: './set-perfil.component.html',
  styleUrls: ['./set-perfil.component.scss'],
})
export class SetPerfilComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    perfil: ['', Validators.required],
    comisaria: ['', Validators.required],
  });
  public mostrarValidaciones: boolean = false;
  public comisarias: ComisariaAuth[] = this.authService.comisariasList;
  private perfiles: PerfilAuth[] = this.authService.perfilesList;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { perfiles: string[] },
    private matDialogRef: MatDialogRef<SetPerfilComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form.get('comisaria')!.setValue(this.primeraComisaria);
  }

  get primeraComisaria() {
    return this.comisarias && this.comisarias.length > 0
      ? this.comisarias[0].idComisaria
      : 0;
  }

  get perfilesFiltrados() {
    return this.perfiles.filter(
      (val) => val.idComisaria == this.form.get('comisaria')!.value
    );
  }

  ngOnInit(): void {}

  public cerrarModal() {
    this.matDialogRef.close(false);
  }
  public cerrarSesion() {
    this.cerrarModal();
    this.authService.cerrarSesion();
  }
  public guardar() {
    if (this.form.valid) {
      this.mostrarValidaciones = false;
      const { perfil, comisaria } = this.form.value;
      this.matDialogRef.close({
        perfil,
        comisaria,
        refresh: true,
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
    if (this.form.controls[campo]) {
      return this.form.controls[campo].hasError('required');
    } else {
      return false;
    }
  }
}
