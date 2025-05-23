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
  public estratos: Record<number, string> = {
    1: "Uno",
    2: "Dos",
    3: "Tres",
    4: "Cuatro",
    5: "Cinco",
    6: "Seis",
    0: "Invasión"
  };

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
      escolarizado: true,
      matriculadoEnElColegio: [''],
      gradoCursa: [''],
      jornadaEstudio: [''],
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
      estratificacion: '1',
      asisteExtracurriculares: false,
      actividadesExtracurriculares: '',
      familiaExtensa: false,
      otraInformacionFamiliaExtensa: '',
      observacionesTrabajoSocial: '',
      observacionesPsicologia: '',
    });
  }

  /**
   * @description escucha cambios en el formulario
   */
  private cambiosForm() {
    this.derechosSegundo.controls['escolarizado'].valueChanges.subscribe(v => {
      if (!v) {
        this.derechosSegundo.controls['matriculadoEnElColegio'].disable();
        this.derechosSegundo.controls['matriculadoEnElColegio'].setValue('N/A');
        this.derechosSegundo.controls['gradoCursa'].disable();
        this.derechosSegundo.controls['gradoCursa'].setValue('N/A');
        this.derechosSegundo.controls['jornadaEstudio'].disable();
        this.derechosSegundo.controls['jornadaEstudio'].setValue('N/A');
      }
      else {
        this.derechosSegundo.controls['matriculadoEnElColegio'].enable();
        this.derechosSegundo.controls['matriculadoEnElColegio'].setValue('');
        this.derechosSegundo.controls['gradoCursa'].enable();
        this.derechosSegundo.controls['gradoCursa'].setValue('');
        this.derechosSegundo.controls['jornadaEstudio'].enable();
        this.derechosSegundo.controls['jornadaEstudio'].setValue('');
      }
    });

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
          escolarizado: ValidarCampos.validarBooleanos(
            objInvolucrado.escolarizado
          ),
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
          observacionesTrabajoSocial: ValidarCampos.validarString(
            objInvolucrado.observacionesTrabajoSocial
          ),
          observacionesPsicologia: ValidarCampos.validarString(
            objInvolucrado.observacionesPsicologia
          ),
        });
      }
    }
  }
}
