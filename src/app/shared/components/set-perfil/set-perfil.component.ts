import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { environment } from '../../../../environments/environment'; // No se necesita aquí directamente
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
  private allUserPerfiles: PerfilAuth[] = this.authService.perfilesList; // Renombrado para claridad

  // AÑADIDO: Propiedad para los perfiles que se mostrarán en el dropdown según la comisaría
  public perfilesDisponibles: PerfilAuth[] = []; // <--- AÑADIDO

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { perfiles: string[] }, // `data.perfiles` puede ser redundante si usas authService.perfilesList
    private matDialogRef: MatDialogRef<SetPerfilComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    // MODIFICADO: Suscribirse a cambios en la comisaría para actualizar perfiles disponibles
    this.form.get('comisaria')!.valueChanges.subscribe(comisariaId => {
      this.filterProfilesByComisaria(comisariaId);
    });

    // MODIFICADO: Intentar preseleccionar comisaría si ya hay una guardada o la primera
    const currentSelectedComisariaId = this.authService.getselectComisariaValue(this.authService.id_comisaria);

    if (currentSelectedComisariaId && this.comisarias.some(c => c.idComisaria === currentSelectedComisariaId)) {
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

  // `perfilesFiltrados` no es tan dinámico como `perfilesDisponibles` con el .valueChanges
  // Si lo usas en el HTML para el *ngFor de los <mat-option>, deberías usar `perfilesDisponibles`
  // get perfilesFiltrados() {
  //   return this.allUserPerfiles.filter(
  //     (val) => val.idComisaria == this.form.get('comisaria')!.value
  //   );
  // }

  ngOnInit(): void {
    this.filterProfilesByComisaria(this.form.get('comisaria')!.value);

    if (this.comisarias.length === 1 && this.allUserPerfiles.length === 1 && this.allUserPerfiles[0].idComisaria === this.comisarias[0].idComisaria) {
        this.form.get('comisaria')!.setValue(this.comisarias[0].idComisaria);
        this.filterProfilesByComisaria(this.comisarias[0].idComisaria);
        this.form.get('perfil')!.setValue(this.allUserPerfiles[0].perfil);
        this.guardar(); 
        // Opcional: matDialogRef.disableClose = true; para evitar cierre manual
    }
  }

  private filterProfilesByComisaria(comisariaId: number): void {
    if (comisariaId) {
      this.perfilesDisponibles = this.allUserPerfiles.filter(
        (p) => p.idComisaria === comisariaId
      );
      if (this.perfilesDisponibles.length === 1) {
        this.form.get('perfil')!.setValue(this.perfilesDisponibles[0].perfil);
      } else {
        this.form.get('perfil')!.setValue('');
      }
    } else {
      this.perfilesDisponibles = [];
      this.form.get('perfil')!.setValue('');
    }
  }

  getNombrePerfilSeleccionado(): string | null {
    const selectedPerfilCode = this.form.get('perfil')!.value;
    const selectedPerfil = this.perfilesDisponibles.find(p => p.perfil === selectedPerfilCode);
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

      this.authService.setComisariaAndProfileSelection(comisaria, nombreLegiblePerfil); 

      this.matDialogRef.close({
        perfil, 
        comisaria,
        nombrePerfil: nombreLegiblePerfil,
        refresh: true,
      });
      console.log('SetPerfilComponent LOG: Modal cerrado con éxito.');
    } else {
      this.mostrarValidaciones = true;
      console.log('SetPerfilComponent LOG: Formulario inválido.');
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.form.controls[campo]) {
      return this.form.controls[campo].hasError('required') && (this.form.controls[campo].touched || this.mostrarValidaciones);
    } else {
      return false;
    }
  }
}