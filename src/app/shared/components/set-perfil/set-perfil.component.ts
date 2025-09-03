import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    perfil: [null, Validators.required],
    comisaria: ['', Validators.required],
  });
  public mostrarValidaciones: boolean = false;
  public comisarias: ComisariaAuth[] = this.authService.comisariasList;
  private allUserPerfiles: PerfilAuth[] = this.authService.perfilesList;

  public perfilesDisponibles: PerfilAuth[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { perfiles: string[] },
    private matDialogRef: MatDialogRef<SetPerfilComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Escuchar cambios de comisaria
    this.form.get('comisaria')!.valueChanges.subscribe((comisariaId) => {
      this.filterProfilesByComisaria(comisariaId);
    });

    // Preseleccionar comisaria actual o la primera
    const currentSelectedComisariaId = this.authService.getselectComisariaValue(
      this.authService.id_comisaria
    );

    if (
      currentSelectedComisariaId &&
      this.comisarias.some((c) => c.idComisaria === currentSelectedComisariaId)
    ) {
      this.form.get('comisaria')!.setValue(currentSelectedComisariaId);
    } else {
      this.form.get('comisaria')!.setValue(this.primeraComisaria);
    }
  }

  get primeraComisaria() {
    return this.comisarias && this.comisarias.length > 0
      ? this.comisarias[0].idComisaria
      : 0;
  }

  ngOnInit(): void {
    this.filterProfilesByComisaria(this.form.get('comisaria')!.value);

    // Si solo hay una comisaria y un perfil, se selecciona automáticamente
    if (
      this.comisarias.length === 1 &&
      this.allUserPerfiles.length === 1 &&
      this.allUserPerfiles[0].idComisaria === this.comisarias[0].idComisaria
    ) {
      this.form.get('comisaria')!.setValue(this.comisarias[0].idComisaria);
      this.filterProfilesByComisaria(this.comisarias[0].idComisaria);
      this.form.get('perfil')!.setValue(this.allUserPerfiles[0].perfil);
      this.guardar();
    }
  }

  private filterProfilesByComisaria(comisariaId: number): void {
    if (comisariaId) {
      this.perfilesDisponibles = this.allUserPerfiles.filter(
        (p) => p.idComisaria === comisariaId
      );
      // Reiniciar perfil a null -> siempre queda en "Seleccione perfil"
      this.form.get('perfil')!.setValue(null);
    } else {
      this.perfilesDisponibles = [];
      this.form.get('perfil')!.setValue(null);
    }
  }

  getNombrePerfilSeleccionado(): string | null {
    const selectedPerfilCode = this.form.get('perfil')!.value;
    const selectedPerfil = this.perfilesDisponibles.find(
      (p) => p.perfil === selectedPerfilCode
    );
    return selectedPerfil ? selectedPerfil.nombrePerfil : null;
  }

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

      const nombreLegiblePerfil = this.getNombrePerfilSeleccionado();

      this.authService.setComisariaAndProfileSelection(
        comisaria,
        nombreLegiblePerfil
      );

      this.matDialogRef.close({
        perfil,
        comisaria,
        nombrePerfil: nombreLegiblePerfil,
        refresh: true,
      });
    } else {
      this.mostrarValidaciones = true;
    }
  }

  public isRequired(campo: string): boolean {
    if (this.form.controls[campo]) {
      return (
        this.form.controls[campo].hasError('required') &&
        (this.form.controls[campo].touched || this.mostrarValidaciones)
      );
    } else {
      return false;
    }
  }
}
