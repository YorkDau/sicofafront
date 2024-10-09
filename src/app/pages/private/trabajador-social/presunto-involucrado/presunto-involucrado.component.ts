import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  CodigosRespuesta,
  InvolucradosPARD,
  Mensajes,
  Regex,
} from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { SharedService } from 'src/app/services/shared.service';
import { AppState } from 'src/app/store/app.reducer';
import { TrabajadorSocialService } from '../services/trabajador-social.service';
import { ValidarCampos } from '../validar-campos';

@Component({
  selector: 'app-presunto-involucrado',
  templateUrl: './presunto-involucrado.component.html',
  styles: [],
})
export class PresuntoInvolucradoComponent implements OnInit, OnDestroy {
  public involucradoForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public listaTipoDocumento: DominioInterface[] = [];
  public listaLugarExp: Array<any> = [];
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgCorreoInv: string = Mensajes.MENSAJE_CORREO_INV;
  public edadMaxima: number = InvolucradosPARD.EDAD_MAXIMA_ACCIONANTE;
  public mensajeEdad: string = InvolucradosPARD.MSJ_EDAD_ACCIONANTE;

  private involucradoSub!: Subscription;
  private tipoDocumentoSub!: Subscription;
  private objSol!: any;

  constructor(
    private fb: FormBuilder,
    private trabajadorSocialService: TrabajadorSocialService,
    private store: Store<AppState>,
    private sharedService: SharedService
  ) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnDestroy(): void {
    if (this.involucradoSub) {
      this.involucradoSub.unsubscribe();
      this.tipoDocumentoSub.unsubscribe();
    }
    sessionStorage.removeItem('inv_pard');
    this.trabajadorSocialService.emitirAgresor(true);
  }

  ngOnInit(): void {
    this.involucradoSub = this.trabajadorSocialService.involucrado$.subscribe(
      (v) => (this.mostrarValidaciones = v)
    );

    if (sessionStorage.getItem('inv_pard')) {
      this.ajustarTiposDocumento(false);
    } else this.ajustarTiposDocumento(true);

    this.cargarForm();
    this.cargaSelectLugarExpedicion();
    this.cargarFormEdicion();
  }

  /**
   * @description ajusta el listado tipo de documento según el tipo de involucrado
   * @param estado true víctima, false agresor
   */
  private ajustarTiposDocumento(estado: boolean): void {
    this.tipoDocumentoSub = this.store
      .select('tipo_documento')
      .subscribe(({ tipo_documento }) => {
        if (estado)
          this.listaTipoDocumento = tipo_documento.filter(
            (v) => v.codigo === 'NUIP'
          );
        else this.listaTipoDocumento = tipo_documento;
      });
  }

  /**
   * @description carga formulario
   */
  private cargarForm(): void {
    this.involucradoForm = this.fb.group({
      idSolicitudServicio: this.objSol.idSolicitud,
      idInvolucrado: 0,
      numeroDocumento: ['', Validators.required],
      tipoDocumento: [0, Validators.min(1)],
      primerNombre: ['', Validators.required],
      segundoNombre: '',
      primerApellido: ['', Validators.required],
      segundoApellido: '',
      esVictima: true,
      esPrincipal: true,
      idLugarExpedicion: [0, Validators.min(1)],
      telefono: '',
      correoElectronico: ['', Validators.pattern(Regex.EMAIL)],
      datosAdicionales: '',
      registroExpedidoEn: 'Notaria',
      nombreEntidadExpedicion: '',
      edad: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(this.edadMaxima),
        ],
      ],
    });
  }

  /**
   * @description carga el select de sexo
   */
  private cargaSelectLugarExpedicion(): void {
    this.sharedService.getLugarExpedicion().subscribe((data) => {
      if (data.statusCode === CodigosRespuesta.OK) {
        this.listaLugarExp = data.data;
      }
    });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.involucradoForm.controls[campo]) {
      return this.involucradoForm.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isMin(campo: string): boolean {
    if (this.involucradoForm.controls[campo]) {
      return this.involucradoForm.controls[campo].hasError('min');
    } else {
      return false;
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isMax(campo: string): boolean {
    if (this.involucradoForm.controls[campo]) {
      return this.involucradoForm.controls[campo].hasError('max');
    } else {
      return false;
    }
  }

  /**
   * @description emite si es agresor o no
   * @param valor false agresor, true involucrado
   */
  public cambioInvolucrado(valor: string): void {
    const val = valor === 'true' ? true : false;
    this.trabajadorSocialService.emitirAgresor(val);
    if (!val) {
      this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_ACCIONADO;
      this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_ACCIONADO;

      this.ajustarTiposDocumento(false);
    } else {
      this.ajustarTiposDocumento(true);
    }
    this.involucradoForm.controls['tipoDocumento'].setValue(0);
    this.involucradoForm.controls['edad'].setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(this.edadMaxima),
    ]);
    this.involucradoForm.controls['edad'].updateValueAndValidity();
  }

  /**
   * @description carga formulario para edición
   */
  private cargarFormEdicion(): void {
    const objInvolucrado = JSON.parse(sessionStorage.getItem('inv_pard')!);

    if (objInvolucrado) {
      this.trabajadorSocialService.emitirAgresor(
        ValidarCampos.validarBooleanos(objInvolucrado.esVictima)
      );

      this.involucradoForm.patchValue({
        idSolicitudServicio: objInvolucrado.idSolicitudServicio,
        idInvolucrado: objInvolucrado.idInvolucrado,
        numeroDocumento: objInvolucrado.numeroDocumento,
        tipoDocumento: ValidarCampos.validarNumber(
          objInvolucrado.idTipoDocumento
        ),
        primerNombre: objInvolucrado.primerNombre,
        segundoNombre: ValidarCampos.validarString(
          objInvolucrado.segundoNombre
        ),
        primerApellido: objInvolucrado.primerApellido,
        segundoApellido: ValidarCampos.validarString(
          objInvolucrado.segundoApellido
        ),
        esVictima: ValidarCampos.validarBooleanos(objInvolucrado.esVictima),
        esPrincipal: ValidarCampos.validarBooleanos(objInvolucrado.esPrincipal),
        idLugarExpedicion: ValidarCampos.validarNumber(
          objInvolucrado.idLugarExpedicion
        ),
        telefono: ValidarCampos.validarString(objInvolucrado.telefono),
        correoElectronico: ValidarCampos.validarString(
          objInvolucrado.correoElectronico
        ),
        datosAdicionales: ValidarCampos.validarString(
          objInvolucrado.datosAdicionales
        ),
        registroExpedidoEn: ValidarCampos.validarString(
          objInvolucrado.registroExpedidoEn
        ),
        nombreEntidadExpedicion: ValidarCampos.validarString(
          objInvolucrado.nombreEntidadExpedicion
        ),
        edad: ValidarCampos.validarNumber(objInvolucrado.edad),
      });

      this.ajustarEdicionValidacionesEdad(objInvolucrado.esVictima);
    }
  }

  /**
   * @description ajusta las validaciones campo edad
   * @param esVictima true involucrado, false agresor
   */
  private ajustarEdicionValidacionesEdad(esVictima: boolean): void {
    if (!esVictima) {
      this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_ACCIONADO;
      this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_ACCIONADO;
      this.involucradoForm.controls['edad'].setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(this.edadMaxima),
      ]);
      this.involucradoForm.controls['edad'].updateValueAndValidity();
    }
  }

  /**
   * @description valida que el campo cumpla la expresión regular
   * @param campo campo a validar del form
   * @returns boleano
   */
  public patternValid(campo: string): boolean {
    if (this.involucradoForm.controls[campo]) {
      return this.involucradoForm.controls[campo].hasError('pattern');
    } else {
      return false;
    }
  }
}
