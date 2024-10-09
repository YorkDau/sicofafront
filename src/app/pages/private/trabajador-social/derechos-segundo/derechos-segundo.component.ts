import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Mensajes } from 'src/app/constants';
import { TrabajadorSocialService } from '../services/trabajador-social.service';
import { ValidarCampos } from '../validar-campos';

@Component({
  selector: 'app-derechos-segundo',
  templateUrl: './derechos-segundo.component.html',
  styles: [],
})
export class DerechosSegundoComponent implements OnInit {
  public derechosSegundo!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public mostrarTipoVivienda: boolean = false;
  public mostrarRecreacion: boolean = false;
  public mostrarRedes: boolean = false;

  private derechosP2Sub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private trabajadorSocial: TrabajadorSocialService
  ) {}

  ngOnDestroy(): void {
    if (this.derechosP2Sub) this.derechosP2Sub.unsubscribe();
  }

  ngOnInit(): void {
    this.derechosP2Sub = this.trabajadorSocial.derechosP2$.subscribe(
      (v) => (this.mostrarValidaciones = v)
    );
    this.cargarForm();
    this.cambiosForm();
    this.cargarFormEdicion();
  }

  /**
   * @description inicializa formulario
   */
  private cargarForm() {
    this.derechosSegundo = this.fb.group({
      matriculadoEnElColegio: ['', Validators.required],
      gradoCursa: ['', Validators.required],
      jornadaEstudio: ['', Validators.required],
      tipoVivienda: 'Arriendo',
      otroTipoVivienda: 'Casa',
      otroTipoViviendaCual: '',
      numeroHabitacionesVivienda: '',
      distribuciuonHabitaciones: '',
      viviendaConBaños: true,
      viviendaConCocina: true,
      viviendaConLuz: true,
      viviendaConAgua: true,
      viciendaConGas: true,
      otrosServicios: true,
      estratificacion: '',
      asisteExtracurriculares: false,
      actividadesExtracurriculares: '',
      familiaExtensa: false,
      otraInformacionFamiliaExtensa: '',
    });
  }

  /**
   * @description escucha cambios en el formulario
   */
  private cambiosForm() {
    this.derechosSegundo.controls['otroTipoVivienda'].valueChanges.subscribe(
      (v) => {
        if (v === 'Otro') {
          this.mostrarTipoVivienda = true;
          this.derechosSegundo.controls['otroTipoViviendaCual'].setValidators([
            Validators.required,
          ]);
        } else {
          this.mostrarTipoVivienda = false;
          this.derechosSegundo.controls[
            'otroTipoViviendaCual'
          ].clearValidators();
          this.derechosSegundo.controls[
            'otroTipoViviendaCual'
          ].updateValueAndValidity();
        }
      }
    );
    this.derechosSegundo.controls[
      'asisteExtracurriculares'
    ].valueChanges.subscribe((v) => {
      if (v) {
        this.mostrarRecreacion = true;
        this.derechosSegundo.controls[
          'actividadesExtracurriculares'
        ].setValidators([Validators.required]);
      } else {
        this.mostrarRecreacion = false;
        this.derechosSegundo.controls[
          'actividadesExtracurriculares'
        ].clearValidators();
        this.derechosSegundo.controls[
          'actividadesExtracurriculares'
        ].updateValueAndValidity();
      }
    });
    this.derechosSegundo.controls['familiaExtensa'].valueChanges.subscribe(
      (v) => {
        if (v) {
          this.mostrarRedes = true;
          this.derechosSegundo.controls[
            'otraInformacionFamiliaExtensa'
          ].setValidators([Validators.required]);
        } else {
          this.mostrarRedes = false;
          this.derechosSegundo.controls[
            'otraInformacionFamiliaExtensa'
          ].clearValidators();
          this.derechosSegundo.controls[
            'otraInformacionFamiliaExtensa'
          ].updateValueAndValidity();
        }
      }
    );
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.derechosSegundo.controls[campo]) {
      return this.derechosSegundo.controls[campo].hasError('required');
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
        this.derechosSegundo.patchValue({
          matriculadoEnElColegio: ValidarCampos.validarString(
            objInvolucrado.matriculadoEnElColegio
          ),
          gradoCursa: ValidarCampos.validarString(objInvolucrado.gradoCursa),
          jornadaEstudio: ValidarCampos.validarString(
            objInvolucrado.jornadaEstudio
          ),
          tipoVivienda: ValidarCampos.validarString(
            objInvolucrado.tipoVivienda
          ),
          otroTipoVivienda: ValidarCampos.validarString(
            objInvolucrado.otroTipoVivienda
          ),
          otroTipoViviendaCual: ValidarCampos.validarString(
            objInvolucrado.otroTipoViviendaCual
          ),
          numeroHabitacionesVivienda: ValidarCampos.validarNumber(
            objInvolucrado.numeroHabitacionesVivienda
          ),
          distribuciuonHabitaciones: ValidarCampos.validarString(
            objInvolucrado.distribuciuonHabitaciones
          ),
          viviendaConBaños: ValidarCampos.validarBooleanos(
            objInvolucrado.viviendaConBaños
          ),
          viviendaConCocina: ValidarCampos.validarBooleanos(
            objInvolucrado.viviendaConCocina
          ),
          viviendaConLuz: ValidarCampos.validarBooleanos(
            objInvolucrado.viviendaConLuz
          ),
          viviendaConAgua: ValidarCampos.validarBooleanos(
            objInvolucrado.viviendaConAgua
          ),
          viciendaConGas: ValidarCampos.validarBooleanos(
            objInvolucrado.viciendaConGas
          ),
          otrosServicios: ValidarCampos.validarBooleanos(
            objInvolucrado.otrosServicios
          ),
          estratificacion: ValidarCampos.validarNumber(
            objInvolucrado.estratificacion
          ),
          asisteExtracurriculares: ValidarCampos.validarBooleanos(
            objInvolucrado.asisteExtracurriculares
          ),
          actividadesExtracurriculares: ValidarCampos.validarString(
            objInvolucrado.actividadesExtracurriculares
          ),
          familiaExtensa: ValidarCampos.validarBooleanos(
            objInvolucrado.familiaExtensa
          ),
          otraInformacionFamiliaExtensa: ValidarCampos.validarString(
            objInvolucrado.otraInformacionFamiliaExtensa
          ),
        });
      }
    }
  }
}
