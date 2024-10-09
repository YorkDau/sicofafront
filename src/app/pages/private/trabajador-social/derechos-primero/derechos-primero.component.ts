import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Mensajes } from 'src/app/constants';
import { TrabajadorSocialService } from '../services/trabajador-social.service';
import { ValidarCampos } from '../validar-campos';

@Component({
  selector: 'app-derechos-primero',
  templateUrl: './derechos-primero.component.html',
  styles: [],
})
export class DerechosPrimeroComponent implements OnInit, OnDestroy {
  public derechosPrimero!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public mostrarInfoSalud: boolean = false;

  private derechosP1Sub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private trabajadorSocial: TrabajadorSocialService
  ) {}

  ngOnDestroy(): void {
    if (this.derechosP1Sub) this.derechosP1Sub.unsubscribe();
  }

  ngOnInit(): void {
    this.derechosP1Sub = this.trabajadorSocial.derechosP1$.subscribe(
      (v) => (this.mostrarValidaciones = v)
    );
    this.cargarForm();
    this.cambiosSalud();
    this.cargarFormEdicion();
  }

  /**
   * @description escucha cambios en formulario
   */
  private cambiosSalud() {
    this.derechosPrimero.controls[
      'vinculacionSistemaSalud'
    ].valueChanges.subscribe((v) => {
      this.mostrarInfoSalud = v;

      if (v) {
        this.derechosPrimero.controls['regimen'].setValidators([
          Validators.required,
        ]);
        this.derechosPrimero.controls['nombreEPS'].setValidators([
          Validators.required,
        ]);
        this.derechosPrimero.controls['beneficiarioDeNombre'].setValidators([
          Validators.required,
        ]);
      } else {
        this.derechosPrimero.controls['regimen'].clearValidators();
        this.derechosPrimero.controls['regimen'].updateValueAndValidity();
        this.derechosPrimero.controls['nombreEPS'].clearValidators();
        this.derechosPrimero.controls['nombreEPS'].updateValueAndValidity();
        this.derechosPrimero.controls['beneficiarioDeNombre'].clearValidators();
        this.derechosPrimero.controls[
          'beneficiarioDeNombre'
        ].updateValueAndValidity();
      }
    });
  }

  /**
   * @description inicializa formulario
   */
  private cargarForm() {
    this.derechosPrimero = this.fb.group({
      nombreResponsableCustodia: ['', Validators.required],
      parentescoResponsableCustodia: ['', Validators.required],
      nombreResponsableCuidado: ['', Validators.required],
      parentescoResponsableCuidado: ['', Validators.required],
      vinculacionSistemaSalud: false,
      regimen: '',
      nombreEPS: '',
      beneficiarioDeNombre: '',
      fisicaAdecuada: true,
      nutricionalAdecuada: true,
      psicologaAdecuada: true,
      vacunacionCompleta: true,
    });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.derechosPrimero.controls[campo]) {
      return this.derechosPrimero.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  /**
   * @description carga formulario para edición
   */
  private cargarFormEdicion() {
    const objInvolucrado = JSON.parse(sessionStorage.getItem('inv_pard')!);

    if (objInvolucrado) {
      if (objInvolucrado.esVictima) {
        this.derechosPrimero.patchValue({
          nombreResponsableCustodia: ValidarCampos.validarString(
            objInvolucrado.nombreResponsableCustodia
          ),
          parentescoResponsableCustodia: ValidarCampos.validarString(
            objInvolucrado.parentescoResponsableCustodia
          ),
          nombreResponsableCuidado: ValidarCampos.validarString(
            objInvolucrado.nombreResponsableCuidado
          ),
          parentescoResponsableCuidado: ValidarCampos.validarString(
            objInvolucrado.parentescoResponsableCuidado
          ),
          vinculacionSistemaSalud: ValidarCampos.validarBooleanos(
            objInvolucrado.vinculacionSistemaSalud
          ),
          regimen: ValidarCampos.validarString(objInvolucrado.regimen),
          nombreEPS: ValidarCampos.validarString(objInvolucrado.eps),
          beneficiarioDeNombre: ValidarCampos.validarString(
            objInvolucrado.beneficiarioDeNombre
          ),
          fisicaAdecuada: ValidarCampos.validarBooleanos(
            objInvolucrado.fisicaAdecuada
          ),
          nutricionalAdecuada: ValidarCampos.validarBooleanos(
            objInvolucrado.nutricionalAdecuada
          ),
          psicologaAdecuada: ValidarCampos.validarBooleanos(
            objInvolucrado.psicologicaAdecuada
          ),
          vacunacionCompleta: ValidarCampos.validarBooleanos(
            objInvolucrado.vacunacionCompleta
          ),
        });
      }
    }
  }
}
